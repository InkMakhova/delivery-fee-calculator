import dayjs, { Dayjs } from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

const MAX_DELIVERY_PRICE = 15;

const FREE_DELIVERY_CART_VALUE = 100;
const MIN_DELIVERY_CART_VALUE = 10;

const MIN_DISTANCE = 1000;
const DISTANCE_STEP = 500;
enum DistancePrice {
  Min = 2,
  Extra = 1,
}

const MIN_NUMBER_OF_ITEMS = 4;
const PRICE_FOR_ITEM = 0.5;

const FRIDAY = 5;
const FRIDAY_RUSH_MULTIPLY = 1.1;

const isDeliveryFree = (cartValue: number) => cartValue >= FREE_DELIVERY_CART_VALUE;

const calculateCartValueSurcharge = (cartValue: number) =>
  cartValue < MIN_DELIVERY_CART_VALUE ? (MIN_DELIVERY_CART_VALUE - cartValue) : 0;

const calculateDistanceFee = (distanceValue: number) => {
  const extraDistance = distanceValue - MIN_DISTANCE;

  return extraDistance > 0 ?
    DistancePrice.Min + Math.ceil(extraDistance / DISTANCE_STEP) * DistancePrice.Extra :
    DistancePrice.Min;
}

const calculateNumberOfItemsSurcharge = (numberOfItems: number) =>
  numberOfItems <= MIN_NUMBER_OF_ITEMS ? 0 : (numberOfItems - MIN_NUMBER_OF_ITEMS) * PRICE_FOR_ITEM;

const isFridayRush = (date: Dayjs) => {
  const timeFrom = date.hour(15).minute(0);
  const timeTo = date.hour(19).minute(0);

  const isFriday = date.day() === FRIDAY;
  const isRush = date.isSameOrAfter(timeFrom) && date.isSameOrBefore(timeTo);

  return isFriday && isRush;
}

const capTotalFee = (total: number) => total < MAX_DELIVERY_PRICE ? total : MAX_DELIVERY_PRICE;

export const calculateDeliveryPrice = (cartValue: number, distanceValue: number, numberOfItems: number, date: Dayjs) => {
  if (isDeliveryFree(cartValue)) {
    return 0;
  }
  const cartValueSurcharge = calculateCartValueSurcharge(cartValue);

  const distanceFee = calculateDistanceFee(distanceValue);

  const numberOfItemsSurcharge = calculateNumberOfItemsSurcharge(numberOfItems);

  const fee = cartValueSurcharge + distanceFee + numberOfItemsSurcharge;
  const total = isFridayRush(date) ? fee * FRIDAY_RUSH_MULTIPLY : fee;

  return capTotalFee(total);
}
