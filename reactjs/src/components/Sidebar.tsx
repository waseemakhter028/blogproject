import React, { useState } from "react";
import { Accordion, Form } from "react-bootstrap";
import { Category, SideBarProps, SubCategory } from "../types";
import { useCategories } from "../context/CategoriesContext";
import Notification from "./Notification";

function Sidebar(props: Readonly<SideBarProps>) {
  const [selectedCategory, setSelectedCategory] = useState<number>(0);
  const [error, setError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const {
    categories: selectedSubCats,
    addCategory,
    removeCategory,
    resetCategories,
  } = useCategories();

  const handleSubCategory = async (
    e: React.ChangeEvent<HTMLInputElement>,
    id: number,
    selCategory: number
  ) => {
    props.setContentLoader(true);
    setSelectedCategory(selCategory);
    if (selectedCategory !== selCategory) {
      resetCategories();
    }

    let subIds = [];
    for (const subCatId of selectedSubCats) {
      subIds.push(subCatId.id);
    }
  
    if (e.target.checked) {
      addCategory({ id });
      subIds.push(id)
    } else {
      removeCategory(id);
      subIds = subIds.filter(subId => subId !== id)
    }

    if (subIds.length < 1) {
      props.getData();
    } else {
      try {
       
        const formData = {
          action: "filtercodes",
          subcat_ids: subIds,
        };
        const options = {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        };
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/filtercodes`,
          options
        );
        const data = await response.json();
        props.filterData(data.data);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        setError(true);
        setErrorMessage(err.message);
      }
    }
  };
  return (
    <>
      <Notification show={error} message={errorMessage} variant="danger" />
      <Accordion flush>
        {props.categories.length > 0 &&
          props.categories.map((category: Category) => (
            <Accordion.Item key={category.id} eventKey={category.id.toString()}>
              <Accordion.Header>{category.name}</Accordion.Header>
              <Accordion.Body>
                {category.SubCategories.map((subCat: SubCategory) => (
                  <Form.Check
                    key={`${subCat.id}-${category.id}`}
                    type="checkbox"
                    checked={selectedSubCats.some(
                      (selSubCat) => selSubCat.id === subCat.id
                    )}
                    id={`subCat-${subCat.id}-${category.id}`}
                    label={subCat.name}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      handleSubCategory(e, subCat.id, category.id)
                    }
                  />
                ))}
              </Accordion.Body>
            </Accordion.Item>
          ))}
      </Accordion>
    </>
  );
}

export default Sidebar;
