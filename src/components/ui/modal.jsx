import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "./Button";
import {
  X,
  Info,
  Calendar,
  Mail,
  Lock,
  List,
  Edit3,
  Tag,
  Hash,
  Search,
} from "lucide-react";

export default function ModalWithForm({
  isOpen,
  onClose,
  onSubmit,
  title,
  fields = [],
  onFieldChange,
  formData: initialData = {},
  children,             // ✅ Accept children
  footer                // ✅ Accept optional custom footer
}) {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const prevInitialDataRef = useRef();

  useEffect(() => {
    if (isOpen) {
      if (prevInitialDataRef.current !== initialData) {
        const hasChangedContent =
          Object.keys(initialData).length !== Object.keys(formData).length ||
          Object.keys(initialData).some(
            (key) => initialData[key] !== formData[key]
          );

        if (hasChangedContent) {
          setFormData(initialData || {});
          setErrors({});
        }
      }
      prevInitialDataRef.current = initialData;
    }
  }, [initialData, isOpen, formData]);

  const handleChange = (name, value) => {
    const updated = { ...formData, [name]: value };
    setFormData(updated);
    if (errors[name]) {
      setErrors((prevErrors) => ({ ...prevErrors, [name]: null }));
    }
    if (onFieldChange) {
      onFieldChange(name, value);
    }
  };

  const validate = () => {
    const newErrors = {};
    fields.forEach((field) => {
      if (field.required && !formData?.[field.name]?.toString().trim()) {
        newErrors[field.name] = `${field.label} is required.`;
      }
      if (
        field.type === "email" &&
        formData?.[field.name] &&
        !/\S+@\S+\.\S+/.test(formData[field.name])
      ) {
        newErrors[field.name] = "Please enter a valid email address.";
      }
      if (
        field.type === "number" &&
        formData?.[field.name] &&
        isNaN(Number(formData[field.name]))
      ) {
        newErrors[field.name] = "Please enter a valid number.";
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit?.(formData);
      onClose?.();
    }
  };

  const getFieldIcon = (type) => {
    switch (type) {
      case "email":
        return Mail;
      case "date":
        return Calendar;
      case "password":
        return Lock;
      case "number":
        return Hash;
      case "search":
        return Search;
      case "select":
        return List;
      case "textarea":
        return Edit3;
      default:
        return Tag;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              onClose?.();
            }
          }}
        >
          <motion.div
            className="bg-white p-6 sm:p-8 rounded-2xl shadow-2xl w-full max-w-2xl lg:max-w-4xl max-h-[90vh] flex flex-col"
            initial={{ y: 50, scale: 0.98, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: 20, scale: 0.98, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex justify-between items-center pb-4 border-b border-gray-200 mb-6">
              <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Optional children block */}
            {children && (
              <div className="text-sm text-gray-700 dark:text-gray-300 mb-6">
                {children}
              </div>
            )}

            {/* Form Section */}
            {fields.length > 0 && (
              <form onSubmit={handleSubmit} className="flex-grow overflow-y-auto pr-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
                  {fields.map((field, idx) => {
                    const hasError = errors[field.name];
                    const FieldIcon = field.icon || getFieldIcon(field.type);
                    const value = formData?.[field.name] ?? "";

                    return (
                      <motion.div
                        key={field.name}
                        className="relative"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.05 * idx, duration: 0.2 }}
                      >
                        <label
                          htmlFor={field.name}
                          className="text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-2"
                        >
                          {typeof FieldIcon === "function" && (
                            <FieldIcon className="w-4 h-4 text-blue-500" />
                          )}
                          {field.label}
                          {field.required && <span className="text-red-500 ml-1">*</span>}
                        </label>

                        {field.type === "custom" && field.component ? (
                          <field.component
                            id={field.name}
                            {...field.props}
                            value={value}
                            onChange={(val) => handleChange(field.name, val)}
                          />
                        ) : field.type === "textarea" ? (
                          <div className="relative">
                            {field.icon && (
                              <field.icon className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                            )}
                            <textarea
                              id={field.name}
                              rows={field.rows || 3}
                              className={`w-full px-4 py-2.5 ${field.icon ? "pl-10" : ""} rounded-lg border shadow-sm focus:outline-none focus:ring-2
                              ${
                                hasError
                                  ? "border-red-500 focus:ring-red-500"
                                  : "border-gray-300 focus:ring-blue-500"
                              } transition placeholder-gray-400 text-gray-800`}
                              value={value}
                              onChange={(e) => handleChange(field.name, e.target.value)}
                              placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
                            />
                          </div>
                        ) : field.type === "select" ? (
                          <select
                            id={field.name}
                            className={`w-full px-4 py-2.5 rounded-lg border shadow-sm focus:outline-none focus:ring-2 appearance-none pr-10
                            ${
                              hasError
                                ? "border-red-500 focus:ring-red-500"
                                : "border-gray-300 focus:ring-blue-500"
                            } transition bg-white text-gray-800`}
                            value={value}
                            onChange={(e) => handleChange(field.name, e.target.value)}
                          >
                            <option value="">{field.placeholder || `Select ${field.label}`}</option>
                            {field.options?.map((opt) => (
                              <option key={opt.value} value={opt.value}>
                                {opt.label}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <input
                            type={field.type}
                            id={field.name}
                            className={`w-full px-4 py-2.5 ${field.icon ? "pl-10" : ""} rounded-lg border shadow-sm focus:outline-none focus:ring-2
                            ${
                              hasError
                                ? "border-red-500 focus:ring-red-500"
                                : "border-gray-300 focus:ring-blue-500"
                            } transition placeholder-gray-400 text-gray-800`}
                            value={value}
                            onChange={(e) => handleChange(field.name, e.target.value)}
                            placeholder={field.placeholder || `Enter ${field.label}`}
                          />
                        )}

                        {hasError && (
                          <motion.p
                            className="text-red-600 text-sm mt-1 flex items-center gap-1"
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -5 }}
                          >
                            <Info className="w-3.5 h-3.5" />
                            {errors[field.name]}
                          </motion.p>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </form>
            )}

            {/* Footer Section */}
            <div className="mt-8 pt-4 border-t border-gray-200">
              {footer ? (
                footer
              ) : (
                <div className="flex justify-end gap-3">
                  <Button variant="ghost" onClick={onClose} className="px-6 py-2 text-lg">
                    Cancel
                  </Button>
                  <Button type="submit" variant="solid" onClick={handleSubmit} className="px-6 py-2 text-lg">
                    Save
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
