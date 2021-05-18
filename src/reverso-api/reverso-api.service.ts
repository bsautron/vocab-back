import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class ReversoApiService {
    protected url = 'https://api.reverso.net'

    getTranslate(word) {
        const data = {
            "input": word,
            "from": "fra",
            "to": "spa",
            "format": "text",
            "options": {
                "origin": "reversodesktop",
                "sentenceSplitter": true,
                "contextResults": true,
                "languageDetection": false
            }
        }
        return axios.post(`${this.url}/translate/v1/translation`, data)
    }

}
