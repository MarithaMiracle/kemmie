import * as React from "react";
import { View, Text, ViewStyle, TextStyle } from "react-native";
import {
  Controller,
  FormProvider,
  useFormContext,
  useFormState,
  type ControllerProps,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";

import { Label } from "./label";

const Form = FormProvider;

type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
  name: TName;
};

const FormFieldContext = React.createContext<FormFieldContextValue>(
  {} as FormFieldContextValue,
);

const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  ...props
}: ControllerProps<TFieldValues, TName>) => {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  );
};

const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext);
  const itemContext = React.useContext(FormItemContext);
  const { getFieldState } = useFormContext();
  const formState = useFormState({ name: fieldContext.name });
  const fieldState = getFieldState(fieldContext.name, formState);

  if (!fieldContext) {
    throw new Error("useFormField should be used within <FormField>");
  }

  const { id } = itemContext;

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  };
};

type FormItemContextValue = {
  id: string;
};

const FormItemContext = React.createContext<FormItemContextValue>(
  {} as FormItemContextValue,
);

function FormItem({ style, children }: { style?: ViewStyle; children?: React.ReactNode }) {
  const id = React.useId();

  return (
    <FormItemContext.Provider value={{ id }}>
      <View style={style}>{children}</View>
    </FormItemContext.Provider>
  );
}

function FormLabel({ children, style }: { children?: React.ReactNode; style?: TextStyle }) {
  const { error } = useFormField();
  return <Label style={[error ? { color: '#EF4444' } : null, style]}>{children}</Label>;
}

function FormControl({ children }: { children?: React.ReactNode }) {
  return <>{children}</>;
}

function FormDescription({ children, style }: { children?: React.ReactNode; style?: TextStyle }) {
  return <Text style={[{ color: '#6B7280', fontSize: 12 }, style]}>{children}</Text>;
}

function FormMessage({ children, style }: { children?: React.ReactNode; style?: TextStyle }) {
  const { error } = useFormField();
  const body = error ? String(error?.message ?? "") : children;
  if (!body) return null;
  return <Text style={[{ color: '#EF4444', fontSize: 12 }, style]}>{body}</Text>;
}

export {
  useFormField,
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormField,
};
