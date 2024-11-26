import { defineComponent, watchEffect } from "vue";
import { useRouter } from "vue-router";
import { useForm } from 'vee-validate';
import * as yup from 'yup';

import { getProductById } from "@/modules/products/actions";
import { useQuery } from "@tanstack/vue-query";

const schema = yup.object({
  title: yup.string().required(),
  slug: yup.string().required(),
  description: yup.string().required(),
  price: yup.number().required(),
  stock: yup.number().min(1).required(),
  gender: yup.string().required().oneOf(['men', 'women', 'kid']),
});


export default defineComponent({
  props: {
    productId: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const router = useRouter();
    const { data: product, isError, isLoading } = useQuery({
      queryKey: ['product', props.productId],
      queryFn: async () => getProductById(props.productId),
      retry: false,
    })
    const { values, defineField, errors } = useForm({
      validationSchema: schema
    });
    const [title, titleAttrs] = defineField('title');
    const [slug, slugAttrs] = defineField('slug');
    const [description, descriptionAttrs] = defineField('description');
    const [price, priceAttrs] = defineField('price');
    const [stock, stockAttrs] = defineField('stock');
    const [gender, genderAttrs] = defineField('gender');


    watchEffect(() => {
      if (isError.value && !isLoading.value) {
        router.replace('/admin/products');
        return
      }
    });

    return {
      // Properties
      values,
      title,
      titleAttrs,
      slug,
      slugAttrs,
      description,
      descriptionAttrs,
      price,
      priceAttrs,
      stock,
      stockAttrs,
      gender,
      genderAttrs,
      errors,

      // Getters
      allSizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    }
  },
});
