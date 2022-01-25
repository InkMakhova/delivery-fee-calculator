import {
  calculateCartValueSurcharge, calculateDeliveryPrice,
  calculateDistanceFee,
  calculateNumberOfItemsSurcharge,
  capTotalFee,
  isDeliveryFree,
  isFridayRush
} from './calculator';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc'

dayjs.extend(utc);

const mockDay = {
  notFriday: dayjs.utc('2022-01-20T17:59:59.653Z'),
  fridayBeforeRush: dayjs.utc('2022-01-21T14:59:59.653Z'),
  fridayRushStart: dayjs.utc('2022-01-21T15:00:00.000Z'),
  fridayRushEnd: dayjs.utc('2022-01-21T18:59:59.653Z'),
  fridayAfterRush: dayjs.utc('2022-01-21T19:00:00.000Z'),
}

describe('Function: isDeliveryFree', () => {
  it('should return true when cart value 10000 cents', () => {
    expect(isDeliveryFree(10000)).toBe(true);
  });
  it('should return true when cart value 10100 cents', () => {
    expect(isDeliveryFree(10100)).toBe(true);
  });
  it('should return false when cart value 9900 cents', () => {
    expect(isDeliveryFree(9900)).toBe(false);
  });
  it('should return false when cart value 0', () => {
    expect(isDeliveryFree(0)).toBe(false);
  });
  it('should return false when cart value -100', () => {
    expect(isDeliveryFree(-100)).toBe(false);
  });
});

describe('Function: calculateCartValueSurcharge', () => {
  it('should return 0 when cart value 1000 cents', () => {
    expect(calculateCartValueSurcharge(1000)).toBe(0);
  });
  it('should return 140 when cart value 860 cents', () => {
    expect(calculateCartValueSurcharge(860)).toBe(140);
  });
  it('should return 0 when cart value -860 cents', () => {
    expect(calculateCartValueSurcharge(-860)).toBe(0);
  });
  it('should return 1000 when cart value 0', () => {
    expect(calculateCartValueSurcharge(0)).toBe(1000);
  });
});

describe('Function: calculateDistanceFee', () => {
  it('should return 200 when distance 1000 m', () => {
    expect(calculateDistanceFee(1000)).toBe(200);
  });
  it('should return 200 when distance 1 m', () => {
    expect(calculateDistanceFee(1)).toBe(200);
  });
  it('should return 200 when distance 0 m', () => {
    expect(calculateDistanceFee(0)).toBe(200);
  });
  it('should return 200 when distance -10 m', () => {
    expect(calculateDistanceFee(-10)).toBe(200);
  });
  it('should return 300 when distance 1499 m', () => {
    expect(calculateDistanceFee(1499)).toBe(300);
  });
  it('should return 300 when distance 1500 m', () => {
    expect(calculateDistanceFee(1500)).toBe(300);
  });
  it('should return 400 when distance 1501 m', () => {
    expect(calculateDistanceFee(1501)).toBe(400);
  });
  it('should return 300 when distance 1499.9 m', () => {
    expect(calculateDistanceFee(1499.9)).toBe(300);
  });
  it('should return 400 when distance 1500.01 m', () => {
    expect(calculateDistanceFee(1500.01)).toBe(400);
  });
});

describe('Function: calculateNumberOfItemsSurcharge', () => {
  it('should return 50 when number of items 5', () => {
    expect(calculateNumberOfItemsSurcharge(5)).toBe(50);
  });
  it('should return 0 when number of items 4', () => {
    expect(calculateNumberOfItemsSurcharge(4)).toBe(0);
  });
  it('should return 0 when number of items 0', () => {
    expect(calculateNumberOfItemsSurcharge(0)).toBe(0);
  });
  it('should return 300 when number of items 10', () => {
    expect(calculateNumberOfItemsSurcharge(10)).toBe(300);
  });
  it('should return 0 when number of items -10', () => {
    expect(calculateNumberOfItemsSurcharge(-10)).toBe(0);
  });
  it('should return 50 when number of items 4.99', () => {
    expect(calculateNumberOfItemsSurcharge(4.99)).toBe(50);
  });
  it('should return 0 when number of items 4.49', () => {
    expect(calculateNumberOfItemsSurcharge(4.49)).toBe(0);
  });
});

describe('Function: isFridayRush', () => {
  it('should return false when date is 20.01.2022 17:59, it\'s not Friday', () => {
    expect(isFridayRush(mockDay.notFriday)).toBe(false);
  });
  it('should return false when date is 21.01.2022 14:59, it\'s Friday', () => {
    expect(isFridayRush(mockDay.fridayBeforeRush)).toBe(false);
  });
  it('should return true when date is 21.01.2022 15:00, it\'s Friday', () => {
    expect(isFridayRush(mockDay.fridayRushStart)).toBe(true);
  });
  it('should return true when date is 21.01.2022 19:00, it\'s Friday', () => {
    expect(isFridayRush(mockDay.fridayRushEnd)).toBe(true);
  });
  it('should return false when date is 21.01.2022 19:01, it\'s Friday', () => {
    expect(isFridayRush(mockDay.fridayAfterRush)).toBe(false);
  });
});

describe('Function: capTotalFee', () => {
  it('should return 5.5 when total 550 cents', () => {
    expect(capTotalFee(550)).toBe(5.5);
  });
  it('should return 0 when total 0', () => {
    expect(capTotalFee(0)).toBe(0);
  });
  it('should return 0 when total 1500 cents', () => {
    expect(capTotalFee(1500)).toBe(15);
  });
  it('should return 14.99 when total 1499', () => {
    expect(capTotalFee(1499)).toBe(14.99);
  });
  it('should return 15 when total 1501', () => {
    expect(capTotalFee(1501)).toBe(15);
  });
  it('should return 0 when total -1501', () => {
    expect(capTotalFee(-1501)).toBe(0);
  });
});

describe('Function: calculateDeliveryPrice', () => {
  it('should return 0 when cart value, distance, number of items are 0, date 20.01.2022 17:59', () => {
    expect(calculateDeliveryPrice(0, 0, 0, mockDay.notFriday)).toBe(0);
  });
  it('should return 2.5 when cart value is 950 cents, distance is 0, number of items are 1, date 20.01.2022 17:59', () => {
    expect(calculateDeliveryPrice(950, 0, 1, mockDay.notFriday)).toBe(2.5);
  });
  it('should return 2 when cart value is 1000 cents, distance is 0, number of items are 1, date 20.01.2022 17:59', () => {
    expect(calculateDeliveryPrice(1000, 0, 1, mockDay.notFriday)).toBe(2);
  });
  it('should return 0 when cart value is 10000 cents, distance is 1100, number of items are 1, date 20.01.2022 17:59', () => {
    expect(calculateDeliveryPrice(10000, 1100, 1, mockDay.notFriday)).toBe(0);
  });
  it('should return 3 when cart value is 9900 cents, distance is 1100, number of items are 4, date 20.01.2022 17:59', () => {
    expect(calculateDeliveryPrice(9900, 1100, 4, mockDay.notFriday)).toBe(3);
  });
  it('should return 3.5 when cart value is 9900 cents, distance is 1100, number of items are 5, date 20.01.2022 17:59', () => {
    expect(calculateDeliveryPrice(9900, 1100, 5, mockDay.notFriday)).toBe(3.5);
  });
  it('should return 6 when cart value is 9900 cents, distance is 1100, number of items are 10, date 20.01.2022 17:59', () => {
    expect(calculateDeliveryPrice(9900, 1100, 10, mockDay.notFriday)).toBe(6);
  });
  it('should return 12 when cart value is 500 cents, distance is 1501, number of items are 10, date 20.01.2022 17:59', () => {
    expect(calculateDeliveryPrice(500, 1501, 10, mockDay.notFriday)).toBe(12);
  });
  it('should return 12 when cart value is 500 cents, distance is 1501, number of items are 10, date 21.01.2022 14:59', () => {
    expect(calculateDeliveryPrice(500, 1501, 10, mockDay.fridayBeforeRush)).toBe(12);
  });
  it('should return 13.2 when cart value is 500 cents, distance is 1501, number of items are 10, date 21.01.2022 15:00', () => {
    expect(calculateDeliveryPrice(500, 1501, 10, mockDay.fridayRushStart)).toBe(13.2);
  });
  it('should return 13.2 when cart value is 500 cents, distance is 1501, number of items are 10, date 21.01.2022 18:59', () => {
    expect(calculateDeliveryPrice(500, 1501, 10, mockDay.fridayRushEnd)).toBe(13.2);
  });
  it('should return 15 when cart value is 150 cents, distance is 1501, number of items are 10, date 21.01.2022 18:59', () => {
    expect(calculateDeliveryPrice(150, 1501, 10, mockDay.fridayRushEnd)).toBe(15);
  });
  it('should return 11 when cart value is 600 cents, distance is 1499, number of items are 10, date 21.01.2022 18:59', () => {
    expect(calculateDeliveryPrice(600, 1499, 10, mockDay.fridayRushEnd)).toBe(11);
  });
  it('should return 5 when cart value is 1000 cents, distance is 1499, number of items are 8, date 21.01.2022 19:00', () => {
    expect(calculateDeliveryPrice(1000, 1499, 8, mockDay.fridayAfterRush)).toBe(5);
  });
  it('should return 14 when cart value is 1000 cents, distance is 5501, number of items are 8, date 21.01.2022 19:00', () => {
    expect(calculateDeliveryPrice(1000, 5501, 8, mockDay.fridayAfterRush)).toBe(14);
  });
  it('should return 14.5 when cart value is 1130 cents, distance is 5501, number of items are 8.8, date 21.01.2022 19:00', () => {
    expect(calculateDeliveryPrice(1130, 5501, 8.8, mockDay.fridayAfterRush)).toBe(14.5);
  });
  it('should return 0 when cart value is 1130 cents, distance is 5501, number of items are 0, date 21.01.2022 19:00', () => {
    expect(calculateDeliveryPrice(1130, 5501, 0, mockDay.fridayAfterRush)).toBe(0);
  });
  it('should return 0 when cart value is -1130 cents, distance is 5501, number of items are -2, date 21.01.2022 19:00', () => {
    expect(calculateDeliveryPrice(-1130, 5501, -2, mockDay.fridayAfterRush)).toBe(0);
  });
  it('should return 11.72 when cart value is 535 cents, distance is 1400, number of items are 10, date 21.01.2022 18:59', () => {
    // 10.65 * 1.1 = 11.715, ensure that it will be rounded to 11.72
    expect(calculateDeliveryPrice(535, 1400, 10, mockDay.fridayRushEnd)).toBe(11.72);
  });
});


