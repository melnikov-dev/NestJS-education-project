# NestJS education project

Учебный проект для закрепления базовой структуры NestJS, валидации входящих данных и работы с PostgreSQL через TypeORM. Ниже — короткий конспект по текущей реализации, чтобы быстро восстановить контекст после перерыва.

## Модули приложения

Корневой `AppModule` собирает всё приложение: подключает конфигурацию, TypeORM и прикладные модули `TaskModule`, `MovieModule`, `ReviewModule` и `ActorModule`.

| Модуль | Назначение |
| --- | --- |
| `task` | Базовый CRUD без базы данных: данные живут в памяти процесса. |
| `movie` | Создание, чтение, обновление и удаление фильмов; работа с постером и актёрами. |
| `review` | Создание отзывов к фильмам. |
| `actor` | Создание актёров и поиск набора актёров по их идентификаторам. |

Контроллер принимает HTTP-запрос, передаёт его сервису, а сервис содержит прикладную логику и, где нужно, обращается к репозиторию TypeORM. Это разделяет транспортный слой и работу с данными.

## `task`: CRUD, DTO и валидация

`TaskModule` — независимый пример базового CRUD. В `TaskService` задачи хранятся в приватном массиве `tasks`; БД и TypeORM здесь не используются. Поэтому данные существуют только пока работает приложение и пропадают после перезапуска.

Маршруты `TaskController`:

| HTTP | Маршрут | Действие |
| --- | --- | --- |
| `GET` | `/tasks` | Получить все задачи. |
| `GET` | `/tasks/:id` | Получить задачу; если её нет, выбрасывается `NotFoundException`. |
| `POST` | `/tasks` | Создать задачу. |
| `PUT` | `/tasks/:id` | Полностью обновить `title` и `isCompleted`. |
| `PATCH` | `/tasks/:id` | Обновить только переданные поля. |
| `DELETE` | `/tasks/:id` | Удалить задачу. |

### DTO

DTO описывает ожидаемое тело запроса и правила его проверки.

- `CreateTaskDto` принимает `title`: непустая строка длиной от 2 до 40 символов.
- `UpdateTaskDto` требует валидные `title` и булево `isCompleted`.
- Передавать DTO в `@Body()` полезно не только как типизацию TypeScript: декораторы `class-validator` выполняются уже во время обработки запроса.

В `main.ts` зарегистрирован глобальный `new ValidationPipe()`. До вызова метода контроллера Nest валидирует экземпляр DTO; при ошибке клиент получает `400 Bad Request`, а сервис не запускается. Параметр `id` в этом модуле поступает строкой и явно преобразуется через `Number(id)`.

### Кастомный валидатор

В `task/decorators/start-with.decorator.ts` определён декоратор `@StartsWith(prefix)`. Он использует `registerDecorator` из `class-validator` и регистрирует функцию `validate`: значение должно быть строкой и начинаться с переданного префикса.

В `CreateTaskDto` он используется как `@StartsWith('Task:')`, поэтому корректный пример тела для `POST /tasks`:

```json
{ "title": "Task: learn NestJS" }
```

При нарушении правила `defaultMessage` формирует сообщение об ошибке. Такой подход нужен, когда готовых декораторов (`@IsString`, `@Length` и т. п.) недостаточно для предметного ограничения.

## TypeORM и конфигурация подключения

TypeORM подключён в `AppModule` двумя частями:

1. `ConfigModule.forRoot({ isGlobal: true })` загружает переменные окружения и делает `ConfigService` доступным во всём приложении.
2. `TypeOrmModule.forRootAsync({ useFactory: getTypeOrmConfig, inject: [ConfigService] })` создаёт одно общее подключение к PostgreSQL асинхронно. Настройки вынесены в `src/config/typeorm.config.ts`, а не находятся в корневом модуле.

Фабрика `getTypeOrmConfig` читает обязательные `TYPEORM_POSTGRES_HOST`, `TYPEORM_POSTGRES_PORT`, `TYPEORM_POSTGRES_USER`, `TYPEORM_POSTGRES_PASSWORD` и `TYPEORM_POSTGRES_DB_NAME` через `getOrThrow`. При отсутствии любой из них приложение завершится на старте с понятной причиной. Порт приложения берётся отдельно из `PORT`, со значением по умолчанию `3000`.

Пример `.env`:

```dotenv
PORT=3000
TYPEORM_POSTGRES_HOST=localhost
TYPEORM_POSTGRES_PORT=5432
TYPEORM_POSTGRES_USER=postgres
TYPEORM_POSTGRES_PASSWORD=postgres
TYPEORM_POSTGRES_DB_NAME=nestjs-education-project

PRISMA_POSTGRES_HOST=localhost
PRISMA_POSTGRES_PORT=5433
PRISMA_POSTGRES_USER=postgres
PRISMA_POSTGRES_PASSWORD=postgres
PRISMA_POSTGRES_DB_NAME=nestjs-education-project
PRISMA_POSTGRES_URI="postgresql://${PRISMA_POSTGRES_USER}:${PRISMA_POSTGRES_PASSWORD}@${PRISMA_POSTGRES_HOST}:${PRISMA_POSTGRES_PORT}/${PRISMA_POSTGRES_DB_NAME}?schema=public"
```

`autoLoadEntities: true` добавляет в подключение entity, зарегистрированные в feature-модулях. `synchronize: true` синхронизирует схему с entity при запуске — удобно для обучения и локальной разработки, но не для production: там нужны миграции, чтобы контролировать изменения схемы и не потерять данные.

### `forRoot` и `forFeature`

- `TypeOrmModule.forRoot(...)` / `forRootAsync(...)` вызывается один раз на уровне приложения. Он создаёт и настраивает соединение с БД.
- `TypeOrmModule.forFeature([Entity])` вызывается в конкретном модуле: `MovieModule`, `ReviewModule` или `ActorModule`. Он регистрирует репозитории указанных entity в области этого модуля.
- После `forFeature` репозиторий внедряется в сервис через `@InjectRepository(Entity) private readonly repository: Repository<Entity>`.

Если сервис одного модуля нужен другому, одного `forFeature` недостаточно: модуль должен экспортировать сервис. Здесь `ActorModule` экспортирует `ActorService` для `MovieModule`, а `MovieModule` экспортирует `MovieService` для `ReviewModule`.

## Entity: модель таблицы

Каждая entity — TypeScript-класс, размеченный декораторами TypeORM. `@Entity({ name: '...' })` задаёт таблицу, `@Column` — столбец и его свойства, а `@PrimaryColumn()` вместе с `@Generated('increment')` — автоинкрементный первичный ключ.

В проекте есть таблицы `movies`, `actors`, `reviews` и `movie_poster`. Также все entity содержат `@CreateDateColumn` и `@UpdateDateColumn`: TypeORM заполняет дату создания и автоматически обновляет дату изменения при сохранении.

На примере `MovieEntity`:

- `title`, `description`, `rating`, `ganre`, `isReleazed` описывают поля фильма; `@Column({ name: 'is_released' })` отделяет имя столбца в БД от имени свойства TypeScript.
- `rating` и оценка отзыва используют точные десятичные типы с `precision` и `scale`.
- `Genre` хранится как PostgreSQL `enum`.
- `nullable: true`, `default`, `length`, `unique` влияют на генерируемую схему БД.

## Связи сущностей

```text
Movie 1 ── 1 MoviePoster
Movie 1 ── * Review
Movie * ── * Actor
          через movies_actors
```

### Один к одному: фильм — постер

`MovieEntity.poster` размечен `@OneToOne`, а `MoviePosterEntity.movie` — обратной стороной `@OneToOne`. Владельцем связи является `MoviePosterEntity`, потому что именно там установлен `@JoinColumn({ name: 'movie_id' })`.

`movie_poster.movie_id` — внешний ключ на `movies.id`; `unique: true` не позволяет нескольким постерам ссылаться на один фильм. `{ onDelete: 'CASCADE' }` означает: при удалении фильма PostgreSQL удалит связанный постер. `@JoinColumn` ставят только на одной, владеющей стороне связи — иначе TypeORM создаст лишние или неверные колонки.

Важно для текущего `MovieService`: он сначала сохраняет новый постер, а затем присваивает его новому фильму. Но `movie_id` находится у постера и по умолчанию обязателен. Для рабочего создания фильма с постером связь нужно сохранить с корректным порядком: сначала создать фильм, затем постер с `movie`, либо настроить `cascade` на связи и сохранять обе сущности одной операцией. Это хороший пример того, почему важно определить владельца связи.

### Один ко многим: фильм — отзывы

У фильма есть массив `reviews` с `@OneToMany`, а каждый `ReviewEntity` содержит одно поле `movie` с `@ManyToOne`. Физический внешний ключ находится на стороне «многие»: `reviews.movie_id`, что задано через `@JoinColumn` в `ReviewEntity`.

`MovieEntity.reviews` — обратная сторона: она удобна для навигации по объектам, но не создаёт отдельного столбца. У отзыва также задан `onDelete: 'CASCADE'`, поэтому удаление фильма удаляет его отзывы.

### Многие ко многим: фильмы — актёры

`MovieEntity.actors` и `ActorEntity.movies` связаны через `@ManyToMany`. Владелец связи — `MovieEntity`: только здесь находится `@JoinTable`, который явно называет промежуточную таблицу `movies_actors` и её колонки `movie_id` и `actor_id`.

Промежуточная таблица хранит пары идентификаторов и позволяет одному фильму иметь много актёров, а актёру сниматься во многих фильмах. `@JoinTable` должен быть на одной стороне; вторая сторона (`ActorEntity.movies`) лишь ссылается на неё.

При создании фильма `MovieService` получает `actorIds`, загружает подходящих актёров через `In(actorIds)` и передаёт их в `movieRepository.create`. При `save` TypeORM сохраняет связь в `movies_actors`. В `findById` указано `relations: { actors: true }`, поэтому актёры загружаются вместе с фильмом; связи в TypeORM не подгружаются автоматически, если это не указать явно или не настроить eager-загрузку.

## Prisma: параллельная реализация

Prisma добавлена как второй ORM, а исходные TypeORM-модули оставлены без изменений. Это позволяет сравнить подходы на одном домене. Prisma-модули используют отдельные таблицы с суффиксом `_2` (`movies_2`, `actors_2`, `reviews_2`, `movie_posters_2`), поэтому две реализации могут безопасно работать в одной базе данных.

| Модуль | Маршрут | Логика |
| --- | --- | --- |
| `actor-2` | `POST /actors-2` | Создать актёра. |
| `movie-2` | `/movies-2` | CRUD фильма, создание постера и привязка актёров. |
| `review-2` | `POST /reviews-2` | Создать отзыв и связать его с фильмом. |
| `poster-2` | `POST /posters-2` | Создать постер для существующего фильма без постера. |

Схема находится в `prisma/schema.prisma`. В ней `Movie2`, `Actor2`, `Review2` и `Poster2` описывают таблицы и связи. `@map` и `@@map` задают имена столбцов и таблиц PostgreSQL, не заставляя переименовывать TypeScript-поля.

`PrismaModule` объявлен глобальным и экспортирует `PrismaService`. Сервис наследует `PrismaClient`: при инициализации Nest он вызывает `$connect()`, а при остановке — `$disconnect()`. Поэтому прикладные сервисы получают один общий клиент через DI, например `constructor(private readonly prisma: PrismaService)`.

### Prisma вместо repository

В TypeORM используется `Repository<Entity>` и `@InjectRepository`. В Prisma клиент генерируется из схемы, а запросы вызываются прямо на модели:

```ts
await this.prisma.movie2.findMany({ orderBy: { createdAt: 'desc' } });
await this.prisma.movie2.findUnique({ where: { id }, include: { actors: true } });
```

Связи задаются в объекте запроса. При создании фильма `Movie2Service` проверяет актёров, затем одним nested write создаёт постер и добавляет связи с актёрами:

```ts
await this.prisma.movie2.create({
  data: {
    title: 'Example',
    poster: { create: { url: 'https://example.com/poster.jpg' } },
    actors: { connect: [{ id: 1 }, { id: 2 }] },
  },
});
```

Nested write выполняется атомарно: если постер или привязка актёров не сохранится, Prisma не создаст частично заполненный фильм. Это устраняет проблему порядка сохранения one-to-one-связи, которая возможна при ручном сохранении связанных объектов.

Для one-to-many в `Review2Service` используется `movie: { connect: { id: movie.id } }`. Один-к-одному реализован обязательным `Poster2.movieId` с `@unique`; при удалении фильма отзывы и постер удаляются через `onDelete: Cascade`. Many-to-many между фильмами и актёрами Prisma хранит в автоматически созданной таблице `_Actor2ToMovie2`.

Prisma берёт строку подключения из `PRISMA_POSTGRES_URI` в `.env`. Контейнер Prisma опубликован на хосте через порт `5433`, тогда как TypeORM использует отдельный контейнер на `5432`. Обе базы могут называться одинаково: это разные экземпляры PostgreSQL с независимыми Docker volumes.

## Middleware и pipes

В проекте добавлены два учебных примера, чтобы на практике почувствовать разницу между этапами обработки запроса в Nest.

### `LoggerMiddleware`

`LoggerMiddleware` подключён ко всем роутам и просто пишет в `console.log` HTTP-метод и базовый URL запроса. Это классическое применение middleware: оно выполняется **до** того, как запрос дойдёт до гарда, пайпа и обработчика контроллера, и ничего не меняет в данных — только наблюдает за фактом запроса. Типичные сценарии для middleware: логирование, добавление заголовков, CORS, rate limiting, аутентификация на уровне «сырого» запроса.

Middleware в Nest — это функция `(req, res, next)`, знакомая по Express. Она не знает про DTO, контроллеры и метаданные Nest: работает с `Request`/`Response` и обязана либо вызвать `next()`, либо завершить ответ. Подключается через `configure(consumer: MiddlewareConsumer)` в модуле:

```ts
configure(consumer: MiddlewareConsumer) {
  consumer.apply(LoggerMiddleware).forRoutes('*');
}
```

### `StringToLowercasePipe` для `POST /movies`

Отдельный пайп трансформирует поле `title` во входящем теле запроса `POST /movies`: приводит строку к нижнему регистру (`toLowerCase`). Сделано исключительно в учебных целях — показать, что пайп может не только проверять данные, но и менять их до попадания в метод контроллера.

Пайп реализует `PipeTransform` и вызывается **после** middleware, но **до** обработчика контроллера. В отличие от middleware, пайп получает уже конкретное значение (`@Body()`, `@Param()`, `@Query()`) и его метатип, поэтому может работать с DTO и `class-validator`. Пайп подключается точечно — на конкретный параметр или на весь роут:

```ts
  @UsePipes(StringToLowercasePipe)
  @Post()
  async create(@Body() dto: CreateMovieDto) {
    return this.movieService.create(dto)
  }
```

### В чём разница

| | Middleware | Pipe |
| --- | --- | --- |
| Когда выполняется | До гардов, пайпов и контроллера | После middleware и гардов, до метода контроллера |
| Что получает | `Request`/`Response` целиком (Express-стиль) | Конкретное значение параметра (`body`, `param`, `query`) и его метатип |
| Знает про DTO и Nest-метаданные | Нет | Да |
| Может менять данные | Технически да (правит `req`), но это не его роль | Да, это его прямая задача: transform |
| Может валидировать | Нет (только вручную) | Да, вместе с `class-validator` |
| Область подключения | Модуль/роут/группа роутов через `MiddlewareConsumer` | Конкретный параметр или роут через декоратор |
| Типичные задачи | Логирование, CORS, заголовки, rate limiting | Валидация, трансформация, приведение типов, парсинг |

Коротко: **middleware смотрит на запрос в целом и работает на транспортном уровне, а pipe — на уровне конкретного значения параметра и умеет его валидировать и преобразовывать**. Поэтому логирование естественно живёт в middleware, а `toLowerCase` для `title` — в пайпе.

## NestJS: общие инструменты (Common)

NestJS предоставляет инструменты для обработки HTTP-запросов: декораторы параметров, Guards, Interceptors, Exception Filters и Pipes. Каждый из них отвечает за отдельный этап обработки запроса.

### 1. Custom Decorators (пользовательские декораторы)

**Назначение:** извлекать данные из запроса и передавать их в параметры обработчика контроллера.

Создаются с помощью `createParamDecorator()`. Внутри доступны пользовательские данные (`data`) и контекст выполнения (`ExecutionContext`), через который можно получить HTTP-запрос.

**Использование в проекте:** `common/decorators/user-agent.decorator.ts` — декоратор `@UserAgent()` извлекает заголовок `user-agent` из запроса и передаёт его в метод контроллера.

```typescript
getHello(@UserAgent() userAgent: string): string {
  return this.appService.getHello(userAgent);
}
```

### 2. Guards (защита маршрутов)

**Назначение:** проверять, разрешено ли выполнять запрос. Используются для авторизации, аутентификации и проверки доступа.

Реализуют интерфейс `CanActivate` и метод `canActivate()`, который возвращает `true` или `false` либо выбрасывает исключение.

Подключаются через `@UseGuards()` или глобально.

**Использование в проекте:** `common/guards/auth.guard.ts` — `AuthGuard` проверяет наличие заголовка `Authorization` с префиксом `Bearer`. При отсутствии заголовка или префикса выбрасывает `UnauthorizedException`.

```typescript
@UseGuards(AuthGuard)
@Get()
getHello() {}
```

*Примечание:* проверка префикса `Bearer` — только базовая проверка формата заголовка, а не полноценная проверка подлинности токена.

### 3. Interceptors (перехватчики)

**Назначение:** выполнять логику до и после вызова обработчика, изменять результат ответа, измерять время выполнения, кэшировать данные и обрабатывать поток результата.

Реализуют интерфейс `NestInterceptor` и метод `intercept()`. Через `next.handle()` получают Observable с результатом обработчика, который можно преобразовать с помощью RxJS.

Подключаются через `@UseInterceptors()` или глобально.

**Использование в проекте:** `common/interceptors/response.interceptor.ts` — `ResponseInterceptor` оборачивает результат контроллера в объект с полями `status` и `data`.

```typescript
@UseInterceptors(ResponseInterceptor)
@Get()
getHello() {}
```

Пример ответа:

```json
{
  "status": "OK",
  "data": "Hello!"
}
```

### 4. Exception Filters (фильтры исключений)

**Назначение:** перехватывать исключения и формировать HTTP-ответ с нужным статусом и структурой. Позволяют централизованно обрабатывать ошибки.

Реализуют интерфейс `ExceptionFilter` и метод `catch()`. Декоратор `@Catch()` определяет, какие исключения обрабатывает фильтр. Без аргументов фильтр перехватывает все исключения, дошедшие до него.

Подключаются через `@UseFilters()` или глобально.

**Использование в проекте:** `common/filters/all-exceptions.filter.ts` — `AllExceptionsFilter` возвращает HTTP-статус, сообщение, время возникновения ошибки и URL запроса. Неизвестные исключения преобразуются в ответ с кодом `500`. Ошибки также записываются в лог.

В `main.ts` фильтр подключается глобально:

```typescript
app.useGlobalFilters(new AllExceptionsFilter());
```

### 5. Pipes (пайпы)

**Назначение:** преобразовывать и валидировать входные данные до передачи их в обработчик контроллера.

Реализуют интерфейс `PipeTransform` и метод `transform()`. Могут преобразовывать типы, проверять значения и выбрасывать исключения при невалидных данных.

Подключаются через `@UsePipes()`, к отдельным параметрам или глобально.

**Использование в проекте:** в `main.ts` глобально подключён `ValidationPipe`, который используется для валидации DTO на основе правил валидации. При включении соответствующих опций он также может преобразовывать входные данные и отсеивать лишние поля.

```typescript
app.useGlobalPipes(new ValidationPipe());
```

### Основные отличия

| Инструмент | Для чего нужен | Когда работает |
|---|---|---|
| Custom Decorators | Извлечение данных в параметры метода | При разрешении параметров обработчика |
| Guards | Проверка доступа к маршруту | До выполнения обработчика |
| Interceptors | Обработка результата и логика вокруг обработчика | До и после обработчика |
| Exception Filters | Формирование ответа при исключениях | Когда возникает необработанное исключение |
| Pipes | Валидация и преобразование входных данных | До передачи аргументов обработчику |

**Общая схема:** запрос проходит через Guards, затем Interceptors (до вызова обработчика), Pipes обрабатывают входные параметры, после чего выполняется метод контроллера. Interceptors также обрабатывают результат после выполнения метода. Если возникает необработанное исключение, его может обработать Exception Filter.

## Запуск

```bash
npm install
npm run start:dev
```

Для модулей `movie`, `review` и `actor` перед запуском должен быть доступен PostgreSQL и заданы переменные из примера выше. Для проверки сборки:

```bash
npm run build
```
