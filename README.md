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

Фабрика `getTypeOrmConfig` читает обязательные `POSTGRES_HOST`, `POSTGRES_PORT`, `POSTGRES_USER`, `POSTGRES_PASSWORD` и `POSTGRES_DB_NAME` через `getOrThrow`. При отсутствии любой из них приложение завершится на старте с понятной причиной. Порт приложения берётся отдельно из `PORT`, со значением по умолчанию `3000`.

Пример `.env`:

```dotenv
PORT=3000
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB_NAME=nestjs_education_project
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

## Запуск

```bash
npm install
npm run start:dev
```

Для модулей `movie`, `review` и `actor` перед запуском должен быть доступен PostgreSQL и заданы переменные из примера выше. Для проверки сборки:

```bash
npm run build
```
