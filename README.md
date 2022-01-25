# Delivery Fee Calculator
Demo
<a href="https://delivery-calculator-makhova.netlify.app/">
    https://delivery-calculator-makhova.netlify.app
</a>

Delivery fee calculator is an application that calculates the shipping cost when a customer is already ready 
with the shopping cart, and we'd like to show him how much the shipping will cost.

The delivery price depends on the cart value, the number of items in the cart, the time of the order, 
and the delivery distance.

## Specification

Rules for calculating a delivery fee:

 * If the cart value is less than 10€, a small order surcharge is added to the delivery price.
The surcharge is the difference between the cart value and 10€. For example if the cart value is 8.90€, 
the surcharge will be 1.10€.

 * A delivery fee for the first 1000 meters (=1km) is 2€. If the delivery distance is longer than that, 
1€ is added for every additional 500 meters that the courier needs to travel before reaching the destination. 
Even if the distance would be shorter than 500 meters, the minimum fee is always 1€.

 * If the number of items is five or more, an additional 50 cent surcharge is added for each item above four.

 * The delivery fee can never be more than 15€, including possible surcharges.

 * The delivery is free (0€) when the cart value is equal or more than 100€.

 * During the Friday rush (3 - 7 PM UTC), the delivery fee (the total fee including possible surcharges) will 
be multiplied by 1.1x. However, the fee still cannot be more than the max (15€).

###### Remarks
 * It's assumed that if the number of items in the cart is 0, then there is nothing to deliver, 
then the delivery price will be 0€.

 * It's assumed that if the cart value is 0€ but the number of items is more than 0 
(e.g. a promotion with 100% discount, free items), then the delivery price will be calculated according to 
the rules above (the surcharge for cart value will be 10€. The customer must pay for shipping even if his 
cart items are free).

 * It's assumed that a customer interacts with local time in the delivery form but time is converted
into UTC for the Friday rush:
   - Example 1: a customer from Helsinki chooses delivery time on Friday 21.01.2022 16:00 (local time).
   It's 21.01.2022 14:00 in UTC. Therefore, it's not the Friday rush and coefficient 1.1 will not be applied.
   - Example 2: a customer from Helsinki chooses delivery time on Friday 21.01.2022 21.00 (local time).
   It's 21.01.2022 19:00 in UTC. Therefore, it's the last minute of the Friday rush and coefficient 1.1 
   will be applied.
   
## Available Scripts

In the project directory, you can run:
### `npm start`

Runs the app in the development mode.
Open http://localhost:3000 to view it in the browser.

### `npm test`

Launches the test runner in the interactive watch mode.

### `npm run build`

Builds the app for production to the build folder.
It correctly bundles React in production mode and optimizes the build for the best performance.


