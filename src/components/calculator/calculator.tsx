import React, { ChangeEvent, FocusEvent, useState } from 'react';
import dayjs from 'dayjs';
import 'flatpickr/dist/themes/material_blue.css';
import Flatpickr from 'react-flatpickr';
import { calculateDeliveryPrice } from "../../lib/calculator";
import utc from 'dayjs/plugin/utc'

dayjs.extend(utc);

function Calculator():JSX.Element {
  const [cartValue, setCartValue] = useState('');
  const [distance, setDistance] = useState('');
  const [numberOfItems, setNumberOfItems] = useState('');
  const [dateTime, setDateTime] = useState(dayjs.utc());
  const [deliveryPrice, setDeliveryPrice] = useState(0);

  const [isCartValueError, setIsCartValueError] = useState(false);
  const [isDistanceError, setIsDistanceError] = useState(false);
  const [isNumberOfItemsError, setIsNumberOfItemsError] = useState(false);

  const validateCartValue = (evt: ChangeEvent<HTMLInputElement> | FocusEvent<HTMLInputElement>) => {
    // using RegExp for validation of cart value (to avoid input of letters in Firefox)
    const regex = new RegExp(/^[0-9]*\.?[0-9]*$/);

    setIsCartValueError(false);

    if (evt.target.value !== '' && !regex.test(evt.target.value)) {
      setIsCartValueError(true)
      evt.target.setCustomValidity('Value must be a number greater than or equal to 0');
      evt.target.reportValidity();
      return;
    }

    evt.target.setCustomValidity('');
    setCartValue(evt.target.value);
  }

  //for validation distance and number of items fields
  const validateIntegerInput = (
    evt: ChangeEvent<HTMLInputElement> | FocusEvent<HTMLInputElement>,
    setState:  React.Dispatch<React.SetStateAction<string>>,
    setIsErrorState: React.Dispatch<React.SetStateAction<boolean>>
    ) => {
    const regex = new RegExp(/^[0-9]*$/);

    setIsErrorState(false);

    if (evt.target.value !== '' && !regex.test(evt.target.value)) {
      setIsErrorState(true)
      evt.target.setCustomValidity('Value must be an integer');
      evt.target.reportValidity();
      return;
    }

    evt.target.setCustomValidity('');
    setState(evt.target.value);
  }

  return (
    <div style={{width: '50%', margin: '1em auto'}}>
      <form>
        <fieldset>
          <legend>Delivery fee calculator</legend>
          <div
            className="form-group"
            style={{
              marginBottom: '1em',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <label
              htmlFor="value"
              className="col-sm-2 col-form-label"
              style={{marginRight: '1em', padding: "0"}}
            >Cart value
            </label>
            <div className="col-sm-10" style={{marginRight: '1em'}}>
              <input
                type="text"
                className="form-control"
                id="value"
                aria-describedby="cart-value"
                placeholder="Cart value"
                required
                onChange={validateCartValue}
                onBlur={(evt: FocusEvent<HTMLInputElement>) => {
                  validateCartValue(evt);
                  if (!isCartValueError && evt.target.value !== '') {
                    setCartValue(Number(evt.target.value).toFixed(2));
                  }
                }}
                value={cartValue}
              />
            </div>
            <p>€</p>
          </div>
          <div
            className="form-group"
            style={{
              marginBottom: '1em',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <label
              htmlFor="distance"
              className="col-sm-2 col-form-label"
              style={{marginRight: '1em', padding: "0"}}
            >Delivery distance
            </label>
            <div className="col-sm-10" style={{marginRight: '1em'}}>
              <input
                type="text"
                className="form-control"
                id="distance"
                placeholder="Delivery distance"
                required
                onChange={(evt) =>
                  validateIntegerInput(evt, setDistance, setIsDistanceError)}
                onBlur={(evt: FocusEvent<HTMLInputElement>) => {
                  validateIntegerInput(evt, setDistance, setIsDistanceError);
                  if (!isDistanceError && evt.target.value !== '') {
                    setDistance(evt.target.value);
                  }
                }}
                value={distance}
              />
            </div>
            <p>m</p>
          </div>
          <div
            className="form-group"
            style={{
              marginBottom: '1em',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <label
              htmlFor="number"
              className="col-sm-2 col-form-label"
              style={{marginRight: '1em', padding: "0"}}
            >Number of items
            </label>
            <div className="col-sm-10" style={{marginRight: '1em'}}>
              <input
                type="text"
                className="form-control"
                id="number"
                placeholder="Number of items"
                required
                value={numberOfItems}
                onChange={(evt) =>
                  validateIntegerInput(evt, setNumberOfItems, setIsNumberOfItemsError)}
                onBlur={(evt: FocusEvent<HTMLInputElement>) => {
                  validateIntegerInput(evt, setNumberOfItems, setIsNumberOfItemsError);
                  if (!isNumberOfItemsError && evt.target.value !== '') {
                    setNumberOfItems(evt.target.value);
                  }
                }}
              />
            </div>
          </div>
          <div
            className="form-group"
            style={{
              marginBottom: '1em',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <label
              htmlFor="time"
              className="col-sm-2 col-form-label"
              style={{marginRight: '1em', padding: "0"}}
            >Order time
            </label>
            <div className="col-sm-10" style={{marginRight: '1em'}}>
              <Flatpickr
                data-enable-time
                onChange={(evt: Date[]) => {
                  // User interacts with local time, so here time is converted to UTC
                  const formatDate = dayjs.utc(evt[0].toString());
                  setDateTime(formatDate);
                }}
                options={{
                  dateFormat: 'd.m.Y H:i',
                  defaultDate: dayjs().format('DD.MM.YYYY HH:mm'),
                  time_24hr: true,
                }}
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{marginBottom: '1em', marginTop: '1em', marginRight: '1em'}}
            onClick={(evt) => {
              evt.preventDefault();
              /*convert € to cents to avoid precision errors*/
              const cartValueParam = Math.round(Number(cartValue) * 100);
              const distanceParam = Number(distance);
              const numberOfItemsParam = Number(numberOfItems);
              setDeliveryPrice(
                calculateDeliveryPrice(cartValueParam, distanceParam, numberOfItemsParam, dateTime)
              )}}
          >
            Calculate delivery price
          </button>
        </fieldset>
      </form>
      <p style={{marginRight: '1em', fontSize: '1.5em'}}>Delivery price:&nbsp;
        <span style={{fontSize: '1em'}}>{deliveryPrice}&nbsp;</span>
        €
      </p>
    </div>
  );
}

export default Calculator;
