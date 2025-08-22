"use client"

import { toast } from "sonner"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

const formSchema = z.object({
  correo: z.string().email({ message: "Por favor ingrese un correo válido." }),
  asunto: z.string().min(1, { message: "Por favor ingrese un asunto válido." }),
  mensaje: z.string().min(1, { message: "Por favor ingrese un mensaje válido." }),
});

export default function ContactForm() {

  const form = useForm < z.infer < typeof formSchema >> ({
    resolver: zodResolver(formSchema),

  })

  function onSubmit(values: z.infer < typeof formSchema > ) {
    try {
      console.log(values);
      toast(
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(values, null, 2)}</code>
        </pre>
      );
    } catch (error) {
      console.error("Form submission error", error);
      toast.error("Por favor verificar el formulario. Intente de nuevo.");
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit, () => {
        toast.error("Por favor verificar el formulario. Intente de nuevo.");
      })} className="space-y-4 max-w-3xl mx-auto py-10">
        <h6 id="contactenos" className="font-semibold">Contactenos</h6>
        <FormField
          control={form.control}
          name="correo"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>Correo</FormLabel>
              <FormControl>
                <Input 
                placeholder="Coloque un correo"
                
                type=""
                {...field} />
              </FormControl>
              <FormDescription>A este correo le responderemos su respuesta.</FormDescription>
              {fieldState.error && <span className="text-sm text-red-600">Por favor ingrese un correo válido.</span>}
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="asunto"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>Asunto</FormLabel>
              <FormControl>
                <Input 
                placeholder="Ingrese una descripcion"
                
                type=""
                {...field} />
              </FormControl>
              
              {fieldState.error && <span className="text-sm text-red-600">Por favor ingrese un asunto válido.</span>}
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="mensaje"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>Mensaje</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Ingrese su mensaje"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              
              {fieldState.error && <span className="text-sm text-red-600">Por favor ingrese un mensaje válido.</span>}
            </FormItem>
          )}
        />
        <Button type="submit">Enviar</Button>
      </form>
    </Form>
  )
}