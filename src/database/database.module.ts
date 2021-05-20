import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { NeofjModule } from "./neofj/neofj.module";

@Module({
    imports: [
        NeofjModule.forRootAsync({
            useFactory: async (config: ConfigService) => {
                return {
                    uri: config.get<string>("NEOFJ_URI") ?? 'bolt://localhost',
                    user: config.get<string>("NEOFJ_USER"),
                    password: config.get<string>("NEOFJ_PASSWORD")
                }
            },
            inject: [ConfigService],
        }),
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
                    entities: ["**/*.entity.ts"],
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
