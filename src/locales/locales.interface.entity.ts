import { Field, InputType, InterfaceType, registerEnumType } from "@nestjs/graphql";
import { IsEnum } from "class-validator";


export enum ELocales {
    FR = "FR",
    ES = "ES",
}

registerEnumType(ELocales, {
    name: "Locales",
    description: "Available locales",
});

@InputType()
export class LocalesSelector {
    @IsEnum(ELocales, { each : true })
    @Field(() => [ELocales])
    langs: ELocales[]
}

@InterfaceType()
export abstract class ILocales {

    @Field({ nullable: true })
    fr?: string;

    @Field({ nullable: true })
    es?: string;
}

