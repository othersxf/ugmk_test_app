import { DiscreteColorLegend, RadialChart } from "react-vis";
import DefaultLayout from "@app/layout/DefaultLayout";
import { useEffect, useState } from "react";
import { fetchProducts } from "@app/store/actions/products";
import { useRouter } from "next/router";
import { REQUEST_STATUS_LIST } from "@app/utils/axios/_request";
import { FILTER_PRODUCT_TYPE } from "@app/store/reducers/userSettings";
import { groupBy, keyBy, keys, omitBy, reduce, sumBy, values } from "lodash";
import { formatDate, parseDate } from "@app/utils/_date";
import { useDispatch, useSelector } from "react-redux";
import { getProductsList, getProductsStatus } from "@app/store/selectors/products";

const myData = [{angle: 1, color:'red'}, {angle: 5}, {angle: 2}]

const COLORS = [ 'green', 'orange', 'grey' ]
const PRODUCT_NAME_MAPPING = {
  'product1': 'Продукт 1',
  'product2': 'Продукт 2',
  'product3': 'Продукт 3',
};

const FACTORY_NAME_MAPPING = {
  '1': 'Фабрики А',
  '2': 'Фабрики Б',
};
export default function DetailPage(){

  const productsStatus = useSelector(getProductsStatus)
  const productsList = useSelector(getProductsList)
  const dispatch = useDispatch();
  const [preparedData, setPreparedData] = useState({});
  const [data, setData] = useState([])
  const router = useRouter()

  useEffect(() => {
    dispatch(fetchProducts())
  }, [dispatch]);

  useEffect(() => {
    if(productsStatus === REQUEST_STATUS_LIST.SUCCESS){
      const products = values(omitBy(keys(productsList[0]), (item) => ['id', 'factory_id', 'date', 'total'].includes(item)))
      const list = productsList.filter((item) =>
          item.factory_id === parseInt(router.query.factory_id)
          && new Date(item.date).getMonth() + 1 === parseInt(router.query.month_number));

      setData(reduce(products, (result, key, index, om) => {
        const value = sumBy(list, key);
        result.push({
          angle: value,
          color: COLORS[index],
          label: Math.round(value/1000),
          labelStyle: { color: COLORS[index] }
        })
        return result;
      }, []))
    }
  }, [productsList, productsStatus, router])

  return (
      <DefaultLayout>
        <h3>Статистика продукции фабрики {FACTORY_NAME_MAPPING[router.query.factory_id]} за {formatDate(parseDate(router.query.month_number, '%m'), '%b')}</h3>
        <RadialChart
            data={data}
            width={400}
            colorRange={COLORS}
            showLabels={true}
            radius={150}
            labelsRadiusMultiplier={1.31}
            height={400} />
        <DiscreteColorLegend items={Object.values(PRODUCT_NAME_MAPPING)} orientation={'horizontal'} colors={COLORS} />
      </DefaultLayout>
  )


}
