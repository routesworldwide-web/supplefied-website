import React,{useEffect} from "react";
import ReactSelect from "react-select";
import { FieldErrors, Controller, Control } from "react-hook-form";
import ErrorMsg from "../../common/error-msg";

export const SUPPLEMENT_PRODUCT_TYPE = {
  value: "electronics",
  label: "Supplements",
};

// prop type
type IPropType = {
  errors: FieldErrors<any>;
  control: Control;
  setSelectProductType: React.Dispatch<React.SetStateAction<string>>;
  default_value?:string;
};

const ProductType = ({
  errors,
  control,
  setSelectProductType,
}: IPropType) => {
  // handleSelectProduct
  const handleSelectProduct = (value: string) => {
    setSelectProductType(value);
  };

  // set default product
  useEffect(() => {
    setSelectProductType(SUPPLEMENT_PRODUCT_TYPE.value);
  }, [setSelectProductType])
  
  return (
    <>
      <Controller
        name="productType"
        control={control}
        defaultValue={SUPPLEMENT_PRODUCT_TYPE}
        rules={{
          required: "productType is required!",
        }}
        render={({ field }) => (
          <ReactSelect
            {...field}
            value={SUPPLEMENT_PRODUCT_TYPE}
            defaultValue={SUPPLEMENT_PRODUCT_TYPE}
            onChange={(selectedOption) => {
              const option = selectedOption || SUPPLEMENT_PRODUCT_TYPE;
              field.onChange(option);
              handleSelectProduct(option.value);
            }}
            options={[SUPPLEMENT_PRODUCT_TYPE]}
          />
        )}
      />
      <ErrorMsg msg={errors?.productType?.message as string} />
    </>
  );
};

export default ProductType;
