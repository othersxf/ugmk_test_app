import { createReadStream } from 'fs'
import * as CsvReadableStream from 'csv-reader';
import getConfig from 'next/config'
const { serverRuntimeConfig } = getConfig()
import path from 'path';
import { parseDate } from "@app/utils/_date";
import { isUndefined } from "lodash";


export default function handler(req, res) {
  const stream = createReadStream(path.join(serverRuntimeConfig.dirs.data, 'data.csv'), 'utf-8');
  let titles = undefined;
  const data = []
  stream
      .pipe(new CsvReadableStream({ parseNumbers: true, parseBooleans: true, trim: true }))
      .on('data', function (row, index) {
        if(isUndefined(titles)){
          titles = row
        }else {
          data.push(row.reduce((result, item, index) => {
            result[titles[index]] = item
            return result
          }, {}))
        }
      })
      .on('end', function () {
        res.status(200).json(data.sort((a, b) => {
          return a.date && b.date && parseDate(a.date).getTime() > parseDate(b.date).getTime()
        }))
      })
      .on('error', function () {
        res.status(500).json({code: 500, message: 'Something wrong'})
      });
}
