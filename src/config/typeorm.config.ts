import { ConfigService } from "@nestjs/config";
import { TypeOrmModuleOptions } from "@nestjs/typeorm";

export async function getTypeOrmConfig(configService: ConfigService): Promise<TypeOrmModuleOptions> {
    return {
        type: 'postgres',
        host: configService.getOrThrow<string>('TYPEORM_POSTGRES_HOST'),
        port: configService.getOrThrow<number>('TYPEORM_POSTGRES_PORT'),
        username: configService.getOrThrow<string>('TYPEORM_POSTGRES_USER'),
        password: configService.getOrThrow<string>('TYPEORM_POSTGRES_PASSWORD'),
        database: configService.getOrThrow<string>('TYPEORM_POSTGRES_DB_NAME'),
        autoLoadEntities: true,
        synchronize: true,
    }
}
