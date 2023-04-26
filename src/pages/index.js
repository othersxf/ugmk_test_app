import DefaultLayout from "@app/layout/DefaultLayout";
import {
  XYPlot,
  XAxis,
  YAxis,
  VerticalGridLines,
  HorizontalGridLines,
  VerticalBarSeries,
  DiscreteColorLegend
} from 'react-vis';
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "@app/store/actions/products";
import { getProductsList, getProductsStatus } from "@app/store/selectors/products";
import { REQUEST_STATUS_LIST } from "@app/utils/axios/_request";
import { getUserSettings } from "@app/store/selectors/userSettings";
import { FILTER_PRODUCT_TYPE, setFilter } from "@app/store/reducers/userSettings";
import { groupBy, omitBy, reduce, sortBy, sumBy, values, keys } from "lodash";
import { formatDate, parseDate } from "@app/utils/_date";
import { useRouter } from "next/router";

const KEYS = {
  ALL: 'Все продукты',
  product1: 'Продукт 1',
  product2: 'Продукт 2',
  product3: 'Продукт 3',
}

const FACTORY_NAME_MAPPING = {
  '1': 'Фабрика А',
  '2': 'Фабрика Б',
};

const COLORS = [ 'red', 'blue' ]

export default function Home() {

  const router = useRouter();
  const [preparedData, setPreparedData] = useState({});
  const [data, setData] = useState({})
  const dispatch = useDispatch();
  const productsStatus = useSelector(getProductsStatus)
  const productsList = useSelector(getProductsList)
  const { filter } = useSelector(getUserSettings)
  const [filters, setFilters] = useState([FILTER_PRODUCT_TYPE.ALL])

  useEffect(() => {
    dispatch(fetchProducts())
  }, [dispatch]);

  useEffect(() => {
    if(productsStatus === REQUEST_STATUS_LIST.SUCCESS){
      setFilters([
          FILTER_PRODUCT_TYPE.ALL,
          ...values(omitBy(keys(productsList[0]), (item) => ['id', 'factory_id', 'date', 'total'].includes(item)))
      ]);
      setPreparedData(groupBy(productsList.map((item) => {
        return {
          ...item,
          x: formatDate(item.date, '%m/%Y'),
          y: 0
        }
      }), 'factory_id'));
    }
  }, [productsStatus, productsList])

  useEffect(() => {
    setData(reduce(preparedData, (result, item, key) => {
      result[key] = sortBy(reduce(values(groupBy(item, 'x')), (result, month_item) => ([
        ...result,
        {
          date: month_item[0].date,
          x: month_item[0].x,
          y: sumBy(month_item, filter === FILTER_PRODUCT_TYPE.ALL ? 'total' : filter),

        }
      ]), []), 'date')

      return result
    }, {}))
  }, [filter, preparedData])

  const onSelectFilter = useCallback((e) => {
    dispatch(setFilter(e.target.value))
  }, [dispatch])

  return (
      <DefaultLayout>
        { productsStatus === REQUEST_STATUS_LIST.SUCCESS && (
            <>
              <div>
                Фильтр по типу продукции
                <select value={filter} onChange={onSelectFilter}>
                  {filters.map((item) => {
                    return (<option value={item} key={item}>{KEYS[item] || item}</option>)
                  })}
                </select>
              </div>
                <XYPlot xType="ordinal" width={600} height={400} xDistance={100} >
                  {<VerticalGridLines />}
                  {<HorizontalGridLines />}
                  {<XAxis tickFormat={tick => formatDate(parseDate(tick, '%m/%Y'), '%b') }/>}
                  {<YAxis tickFormat={tick => tick/1000 + ' т.'} />}
                  <VerticalBarSeries data={data[1] || []} color={COLORS[0]} onValueClick={(data, e) => {
                    router.push('details/1/' + (parseDate(data.x, '%m/%Y').getMonth() + 1) ) }
                  }/>
                  <VerticalBarSeries data={data[2] || []} color={COLORS[1]} onValueClick={(data, e) => {
                    router.push('details/2/' + (parseDate(data.x, '%m/%Y').getMonth() + 1) ) }
                  }/>
                </XYPlot>
                <DiscreteColorLegend items={Object.values(FACTORY_NAME_MAPPING)} orientation={'horizontal'} colors={COLORS} />
            </>
        ) }

      </DefaultLayout>
  )
}
