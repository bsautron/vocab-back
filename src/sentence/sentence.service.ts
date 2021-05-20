import { Injectable } from '@nestjs/common';
import { CategoryService } from '../category/category.service';
import { UserService } from '../user/user.service';
import { Sentence } from './sentence.entity';
import { AddSentencePayload } from './sentence.resolver';

@Injectable()
export class SentenceService {
    constructor(
        protected categoryService: CategoryService,
        protected userService: UserService

    ) { }

}
