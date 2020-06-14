import * as React from "react";
import "./styles.css";


import { useForm } from "react-hook-form";
import * as z from "zod";


const validationSchema = z
  .object({
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    email: z.string().email(),
    password: z.string(),
    confirmPassword: z.string(),
  })
  .refine((data: any) => data?.password === data?.confirmPassword, 'Both password and confirmation must match')

type Inputs = z.infer<typeof validationSchema>

const useZodValidationResolver = (validationSchema: any) =>
React.useCallback(
    async (data: unknown) => {
      console.log('input data', data)
      try {
        const values = await validationSchema.parse(data)

        return {
          values,
          errors: {},
        }
      } catch (error) {
        console.dir(error.errors)
        return {
          values: {},
          errors: error.errors.reduce(
            (allErrors: any, currentError: any) => ({
              ...allErrors,
              [currentError.path[0] ? currentError.path : ['confirmPassword']]: {
                type: currentError.type ?? 'validation',
                message: currentError.message,
              },
            }),
            {}
          ),
        }
      }
    },
    [validationSchema]
  )
export default function App() {
  const validationResolver = useZodValidationResolver(validationSchema)

  const { register, handleSubmit, errors } = useForm<Inputs>({
    validationResolver,
  });
  const onSubmit = (data:any) => console.log(data);


  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
    {/* "handleSubmit" will validate your inputs before invoking "onSubmit" */}
    
    {/* register your input into the hook by invoking the "register" function */}
      <input name="firstName" defaultValue="zod" ref={register} />
      {errors.firstName && <span>This field is required</span>}
      {/* include validation with required or other standard HTML validation rules */}
      <input name="lastName" ref={register({ required: true })} />
      {/* errors will return when field validation fails  */}
      {errors.lastName && <span>This field is required</span>}
      <input name="email" type="email" ref={register({ required: true })} />
      {errors.email && <span>This field is required</span>}
      
      <input name="password" type="password" ref={register({ required: true })} />
      {errors.password && <span>This field is required</span>}
      
      <input name="confirmPassword" type="password" ref={register({ required: true })} />
      {errors.confirmPassword && <span>This field is required</span>}
      <input type="submit" />
    </form>
  );
}
