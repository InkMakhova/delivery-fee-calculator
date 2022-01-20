import { useRef, useState } from 'react';
import dayjs from 'dayjs';
import 'flatpickr/dist/themes/material_blue.css';
import Flatpickr from 'react-flatpickr';
import { calculateDeliveryPrice } from "../../lib/calculator";
import utc from 'dayjs/plugin/utc'

dayjs.extend(utc);

function Calculator():JSX.Element {
  const cartValueRef = useRef<HTMLInputElement | null>(null);
  const distanceRef = useRef<HTMLInputElement | null>(null);
  const numberOfItemsRef = useRef<HTMLInputElement | null>(null);
  const [dateTime, setDateTime] = useState(dayjs.utc());

  const [deliveryPrice, setDeliveryPrice] = useState(0);

  return (
    <div style={{width: '50%', margin: '1em auto'}}>
      <form>
        <fieldset>
          <legend>Delivery fee calculator</legend>
          <div
            className="form-group"
            style={{marginBottom: '1em', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}
          >
            <label
              htmlFor="value"
              className="col-sm-2 col-form-label"
              style={{marginRight: '1em', padding: "0"}}
            >Cart value
            </label>
            <div className="col-sm-10" style={{marginRight: '1em'}}>
              <input
                ref={cartValueRef}
                type="number"
                className="form-control"
                id="value"
                aria-describedby="cart-value"
                placeholder="Cart value"
                required
              />
            </div>
            <p>€</p>
          </div>
          <div
            className="form-group"
            style={{marginBottom: '1em', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}
          >
            <label
              htmlFor="distance"
              className="col-sm-2 col-form-label"
              style={{marginRight: '1em', padding: "0"}}
            >Delivery distance
            </label>
            <div className="col-sm-10" style={{marginRight: '1em'}}>
              <input
                ref={distanceRef}
                type="number"
                className="form-control"
                id="distance"
                placeholder="Delivery distance"
                required
              />
            </div>
            <p>m</p>
          </div>
          <div
            className="form-group"
            style={{marginBottom: '1em', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}
          >
            <label
              htmlFor="number"
              className="col-sm-2 col-form-label"
              style={{marginRight: '1em', padding: "0"}}
            >Number of items
            </label>
            <div className="col-sm-10" style={{marginRight: '1em'}}>
              <input
                ref={numberOfItemsRef}
                type="number"
                className="form-control"
                id="number"
                placeholder="Number of items"
                required
              />
            </div>
          </div>
          <div
            className="form-group"
            style={{marginBottom: '1em', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}
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
                options={{dateFormat: 'd.m.Y H:i', defaultDate: 'today'}}
              />
            </div>
          </div>

          <button
            type="button"
            className="btn btn-primary"
            style={{marginBottom: '1em', marginTop: '1em'}}
            onClick={() => {
              const cartValueParam = Number(cartValueRef.current?.value);
              const distanceParam = Number(distanceRef.current?.value);
              const numberOfItemsParam = Number(numberOfItemsRef.current?.value);
              setDeliveryPrice(calculateDeliveryPrice(cartValueParam, distanceParam, numberOfItemsParam, dateTime))}}
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
