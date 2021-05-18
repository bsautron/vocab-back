import { DynamicModule, Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            useFactory: async (config: ConfigService) => {
                return {
                    global: true,
                    name: "default",
                    type: "postgres" as const,
                    host: "localhost",
                    port: config.get<number>("TYPEORM_PORT") ?? 5432,
                    username: config.get<string>("POSTGRES_USER") ?? "test",
                    password: config.get<string>("POSTGRES_PASSWORD") ?? "test",
                    database: config.get<string>("POSTGRES_DB") ?? "test",
                    entities: ["**/*.entity.js"],
                    logging: true,
                    synchronize: true,
                };
            },
            inject: [ConfigService],
        }),
    ],
})
export class DatabaseModule {
}
