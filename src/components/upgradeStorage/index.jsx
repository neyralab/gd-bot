import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { ReactComponent as CoinIcon } from "../../assets/coin.svg";

import s from "./style.module.css";

export const UpgradeStoragePage = () => {
  const navigate = useNavigate();
  const [checked, setChecked] = useState(false);
  const [plan, setPlan] = useState(null);

  const onBackButtonClick = () => navigate(-1);

  const onPlanClick = (e) => {
    const element = e.target.closest("li");
    if (!element) return;

    const id = element.id;
    if (id === plan) {
      setPlan(null);
      return;
    }
    setPlan(id);
  };

  const Switch = () => {
    return (
      <label className={s.switchWrapper}>
        <input
          onChange={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setChecked((prev) => !prev);
          }}
          type="checkbox"
          checked={checked}
        />
        <span className={s.switch}>
          <span className={s.button}></span>
        </span>
      </label>
    );
  };

  return (
    <div className={s.wrapper}>
      <header className={s.header}>
        <button className={s.header__backBtn} onClick={onBackButtonClick}>
          Back
        </button>
        <button className={s.header__upgradeBtn}>Upgrade Storage</button>
      </header>
      <p className={s.headingText}>
        You will be charged immediately and each payment period until you change
        or cancel your plan.
      </p>
      <div className={s.currentPlanWrapper}>
        <h3 className={s.currentPlanTitle}>Curent plan</h3>
        <div className={s.upgradeOptionCard}>
          <span>5GB</span>
          <div>
            <p>$0.00 per month</p>
            <span>free forever</span>
          </div>
        </div>
        <h3 className={s.currentPlanTitle}>Upgrade options</h3>
        <p className={s.upgradeText}>
          Your storage plan will automatically renew. You can cancel at any
          time. <a href="/">Learn more</a>
        </p>
      </div>
      <div className={s.options}>
        <div className={s.upgradeOptionsHeader}>
          <h3>Ghostdrive+</h3>
          <p>Yearly</p>
          <Switch />
        </div>
        <ul className={s.optionsList} onClick={onPlanClick}>
          <li id="100GB">
            <div
              className={`${s.optionsList__card} ${
                plan === "100GB" ? s.active : ""
              }`}>
              <span>100GB</span>
              <div>
                <p>$0.99 per month</p>
                <span>
                  $11.88 per year <span>-50%</span>
                </span>
              </div>
              <input
                className={s.checkbox}
                type="checkbox"
                checked={plan === "100GB"}></input>
            </div>
          </li>
          <li id="1TB">
            <div
              className={`${s.optionsList__card} ${
                plan === "1TB" ? s.active : ""
              }`}>
              <span>1TB</span>
              <div>
                <p>$2.99 per month</p>
                <span>
                  $35.88 per year <span>-33%</span>
                </span>
              </div>
              <input
                className={s.checkbox}
                type="checkbox"
                checked={plan === "1TB"}></input>
            </div>
          </li>
          <li id="2TB">
            <div
              className={`${s.optionsList__card} ${
                plan === "2TB" ? s.active : ""
              }`}>
              <span>2TB</span>
              <div>
                <p>$4.99 per month</p>
                <span>
                  $59.88 per year <span>-15%</span>
                </span>
              </div>
              <input
                className={s.checkbox}
                type="checkbox"
                checked={plan === "2TB"}></input>
            </div>
          </li>
        </ul>
      </div>
      <button className={s.payButton}>
        Pay <CoinIcon />
      </button>
    </div>
  );
};
