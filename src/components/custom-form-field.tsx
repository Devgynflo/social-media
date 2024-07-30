"use client";

import { NextPage } from "next";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Control } from "react-hook-form";
import { ReactNode } from "react";
import Image from "next/image";

import { FormFieldType } from "@/@types";
import { cn } from "@/lib/utils";
import { PasswordInput } from "./password-input";

interface CustomFormFieldProps {
  control: Control<any>;
  fieldType: FormFieldType;
  name: string;
  label?: string;
  placeholder?: string;
  iconSrc?: string;
  iconAlt?: string;
  disabled?: boolean;
  children?: ReactNode;
  renderSkeleton?: (field: any) => ReactNode;
  className?: string;
}

export const CustomFormField: NextPage<CustomFormFieldProps> = (props) => {
  const { name, label, fieldType, control } = props;
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          {label && (
            <FormLabel>{label}</FormLabel>
          )}
          <RenderField props={props} field={field} />
          <FormMessage  />
        </FormItem>
      )}
    />
  );
};

const RenderField = ({
  field,
  props,
}: {
  field: any;
  props: CustomFormFieldProps;
}) => {
  const {
    name,
    label,
    iconAlt,
    fieldType,
    iconSrc,
    placeholder,
    renderSkeleton,
    children,
    disabled,
    className,
  } = props;

  switch (fieldType) {
    case FormFieldType.INPUT:
      return (
        <div className="flex rounded-md border border-dark-500 bg-dark-400">
          {iconSrc && iconAlt && (
            <Image
              src={iconSrc}
              alt={iconAlt}
              height={24}
              width={24}
              className="ml-2"
            />
          )}
          <FormControl>
            <Input
              placeholder={placeholder}
              {...field}
              className=""
            />
          </FormControl>
        </div>
      );

    case FormFieldType.PASSWORD:
      return (
        <div className="flex rounded-md border border-dark-500 bg-dark-400">
          {iconSrc && iconAlt && (
            <Image
              src={iconSrc}
              alt={iconAlt}
              height={24}
              width={24}
              className="ml-2"
            />
          )}
          <FormControl>
            <PasswordInput {...field} placeholder={placeholder} />
          </FormControl>
        </div>
      );
   
    
    case FormFieldType.SKELETON:
      return renderSkeleton ? renderSkeleton(field) : null;
    
    case FormFieldType.TEXTAREA:
      return (
        <FormControl>
          <Textarea
            {...field}
            placeholder={placeholder}
            className={cn("shad-textArea", className)}
            disabled={disabled}
          />
        </FormControl>
      );
    default:
      break;
  }
};
