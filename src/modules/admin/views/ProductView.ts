import { defineComponent, watch, watchEffect } from "vue";
import { useRouter } from "vue-router";
import { useFieldArray, useForm } from 'vee-validate';
import * as yup from 'yup';
import { useQuery } from "@tanstack/vue-query";


import { getProductById } from "@/modules/products/actions";
import CustomInput from "@/modules/common/components/CustomInput.vue";
import CustomTextArea from "@/modules/common/components/CustomTextArea.vue";


const schema = yup.object({
  title: yup.string().required().min(2),
  slug: yup.string().required(),
  description: yup.string().required(),
  price: yup.number().required(),
  stock: yup.number().min(1).required(),
  gender: yup.string().required().oneOf(['men', 'women', 'kid']),
});


export default defineComponent({
  components: {
    CustomInput,
    CustomTextArea,
  },
  props: {
    productId: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const router = useRouter();
    const { data: product, isError, isLoading, } = useQuery({
      queryKey: ['product', props.productId],
      queryFn: async () => getProductById(props.productId),
      retry: false,
    })
    const { values, defineField, errors, handleSubmit, resetForm, meta } = useForm({
      validationSchema: schema,
    });
    const [title, titleAttrs] = defineField('title');
    const [slug, slugAttrs] = defineField('slug');
    const [description, descriptionAttrs] = defineField('description');
    const [price, priceAttrs] = defineField('price');
    const [stock, stockAttrs] = defineField('stock');
    const [gender, genderAttrs] = defineField('gender');

    const { fields: images, } = useFieldArray<string>('images');
    const { fields: sizes, remove: removeSize, push: pushSize } = useFieldArray<string>('sizes');

    const onSubmit = handleSubmit((value) => {
      console.log(value);
    });


    watchEffect(() => {
      if (isError.value && !isLoading.value) {
        router.replace('/admin/products');
        return
      }
    });

    watch(product, () => {
      if (!product) return;

      resetForm({
        values: product.value,
      });
    }, {
      deep: true,
      immediate: true, //! Important to run the watcher immediately
    })

    const toggleSize = (size: string) => {
      const currentSizes = sizes.value.map(s => s.value);

      const hasSize = currentSizes.includes(size);

      if (hasSize) {
        const index = currentSizes.indexOf(size);
        removeSize(index);
      } else {
        pushSize(size);
      }
    };

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
      images,
      sizes,
      meta,

      // Getters
      allSizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],

      // Methods
      onSubmit,
      toggleSize,

      hasSize: (size: string) => {
        const currentSizes: string[] = sizes.value.map(s => s.value);
        return currentSizes.includes(size);
      }
    }
  },
});
