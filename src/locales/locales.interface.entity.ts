import { Field, InterfaceType } from "@nestjs/graphql";


@InterfaceType()
export abstract class ILocales {

    @Field({ nullable: true })
    fr?: string;

    @Field({ nullable: true })
    es?: string;
}

