// components/EnumFields.jsx
import React from "react";
import { useFieldArray, useFormContext } from "react-hook-form";

export default function EnumFields() {
  const { register, control } = useFormContext();
  const newOption = React.useRef();

  const { fields, append, remove } = useFieldArray({
    name: "enum",
    control,
  });

  const handleAppend = () => {
    const value = newOption.current.value.trim();
    if (value) {
      // ✅ راه‌حل: به جای یک رشته، یک شیء را اضافه می‌کنیم
      append({ value: value });
      newOption.current.value = "";
    }
  };

  return (
    <div className="mt-6 p-4 border border-gray-300 rounded-md bg-gray-50 shadow-sm">
      <h4 className="text-lg font-medium text-gray-800 mb-4">تنظیمات Enum</h4>

      {/* نوع enum */}
      <fieldset className="mb-4">
        <legend className="block text-sm font-medium text-gray-700 mb-2">نوع Enum:</legend>
        <div className="flex items-center gap-4">
          <label className="flex items-center space-x-1 rtl:space-x-reverse">
            <input type="radio" value="string" {...register("enumType")} defaultChecked />
            <span className="text-sm text-gray-700 mr-1">Select Option</span>
          </label>
          <label className="flex items-center space-x-1 rtl:space-x-reverse">
            <input type="radio" value="number" {...register("enumType")} />
            <span className="text-sm text-gray-700 mr-1">Check Box</span>
          </label>
        </div>
      </fieldset>

      {/* اضافه کردن مقادیر */}
      <div className="mb-4 flex gap-2">
        <input
          type="text"
          ref={newOption}
          placeholder="مقدار جدید..."
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full sm:w-auto"
        />
        <button
          type="button"
          onClick={handleAppend}
          className="bg-primary hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors duration-200"
        >
          افزودن
        </button>
      </div>

      {/* لیست مقادیر */}
      {fields.length > 0 && (
        <ul className="space-y-2">
          {fields.map((item, index) => (
            <li
              key={item.id} // useFieldArray یک id منحصر به فرد برای key به ما می‌دهد
              className="flex justify-between items-center p-2 bg-white border border-gray-200 rounded-md shadow-sm"
            >
              <span className="text-gray-800">{item.value}</span>
              <button
                type="button"
                onClick={() => remove(index)}
                className="text-red-500 hover:text-red-700 text-xl font-bold"
              >
                &times;
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}