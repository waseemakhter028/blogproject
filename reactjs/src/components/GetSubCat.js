import React, { useState, useEffect } from "react";
import { $ } from "react-jquery-plugin";
const GetSubCat = ({ catId, filterData, filterBtn }) => {
  const [subcats, setSubCats] = useState([]);
  const getData = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_URL}/getsubcat/${catId}`
      );
      const data = await response.json();
      setSubCats(data.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleCheckbox = async (e) => {
    var chkArray = [];

    // Look for all checkboxes that have a specific class and was checked
    $(".chk:checked").each(function () {
      chkArray.push(parseInt($(this).val()));
    });

    if (chkArray.length > 0) {
      filterBtn(true);
    } else {
      filterBtn(false);
    }

    try {
      const subIds = [];
      for (var i = 0; i < chkArray.length; i++) {
        subIds.push(chkArray[i]);
      }
      const formData = {
            action: "filtercodes",
            subcat_ids:  subIds
      }
      const options = {
        method: "POST",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      };
      const response = await fetch(
        `${process.env.REACT_APP_URL}/filtercodes`,
        options
      );
      const data = await response.json();
      filterData(data.data, data.all);
      console.log(data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <React.Fragment>
      {subcats.map((sub, i) => (
        <li key={i}>
          <label className="form-check-label lblchk" key={i}>
            <input
              type="checkbox"
              className="chk"
              name="subcategory"
              onChange={handleCheckbox}
              defaultValue={sub.id}
            />{" "}
            <span>{sub.name}</span>
          </label>
        </li>
      ))}
    </React.Fragment>
  );
};

export default GetSubCat;
