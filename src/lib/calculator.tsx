import dayjs, { Dayjs } from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

const MAX_DELIVERY_PRICE_EUR = 15;

//prices in cents
const FREE_DELIVERY_CART_VALUE = 10000;
const MIN_DELIVERY_CART_VALUE = 1000;
enum DistancePrice {
  Min = 200,
  Extra = 100,
}
const PRICE_FOR_ITEM = 50;

//distance in meters
const MIN_DISTANCE = 1000;
const DISTANCE_STEP = 500;

const MIN_NUMBER_OF_ITEMS = 4;

const FRIDAY = 5;
const FRIDAY_RUSH_MULTIPLY = 1.1;

export const isDeliveryFree = (cartValue: number) => cartValue >= FREE_DELIVERY_CART_VALUE;

export const calculateCartValueSurcharge = (cartValue: number) =>
  (cartValue < MIN_DELIVERY_CART_VALUE && cartValue > 0) ? (MIN_DELIVERY_CART_VALUE - cartValue) : 0;

export const calculateDistanceFee = (distanceValue: number) => {
  const extraDistance = distanceValue - MIN_DISTANCE;

  return extraDistance > 0 ?
    DistancePrice.Min + Math.ceil(extraDistance / DISTANCE_STEP) * DistancePrice.Extra :
    DistancePrice.Min;
}

export const calculateNumberOfItemsSurcharge = (numberOfItems: number) =>
  numberOfItems <= MIN_NUMBER_OF_ITEMS ? 0 : (Math.round(numberOfItems) - MIN_NUMBER_OF_ITEMS) * PRICE_FOR_ITEM;

export const isFridayRush = (date: Dayjs) => {
  const timeFrom = date.hour(15).minute(0);
  const timeTo = date.hour(19).minute(0);

  const isFriday = date.day() === FRIDAY;
  const isRush = date.isSameOrAfter(timeFrom) && date.isSameOrBefore(timeTo);

  return isFriday && isRush;
}

export const capTotalFee = (total: number) => {
  if (total <= 0) {
    return 0;
  }
  const totalEur = total / 100;
  return totalEur < MAX_DELIVERY_PRICE_EUR ? totalEur : MAX_DELIVERY_PRICE_EUR;
}

export const calculateDeliveryPrice = (cartValue: number, distanceValue: number, numberOfItems: number, date: Dayjs) => {
  if (isDeliveryFree(cartValue) || numberOfItems <= 0) {
    return 0;
  }

  const cartValueSurcharge = calculateCartValueSurcharge(cartValue);

  const distanceFee = calculateDistanceFee(distanceValue);

  const numberOfItemsSurcharge = calculateNumberOfItemsSurcharge(numberOfItems);

  const fee = cartValueSurcharge + distanceFee + numberOfItemsSurcharge;
  const total = isFridayRush(date) ? Math.round(fee * FRIDAY_RUSH_MULTIPLY) : fee;

  return capTotalFee(total);
}
