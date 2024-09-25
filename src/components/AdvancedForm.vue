<template>
  <div class="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
    <form @submit.prevent="handleSubmit(onSubmit)">
      <div class="mb-4">
        <label for="name" class="block text-sm font-medium text-gray-700">Name:</label>
        <input id="name" v-model="nameValue" type="text" class="pl-2 h-10 mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
        <span v-if="nameError" class="text-red-500 text-xs mt-1">{{ nameError }}</span>
      </div>
      <div class="mb-4">
        <label for="email" class="block text-sm font-medium text-gray-700">Email:</label>
        <input id="email" v-model="emailValue" type="email" class="pl-2 h-10 mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
        <span v-if="emailError" class="text-red-500 text-xs mt-1">{{ emailError }}</span>
      </div>
      <div class="mb-4">
        <label for="password" class="block text-sm font-medium text-gray-700">Password:</label>
        <input id="password" v-model="passwordValue" type="password" class="pl-2 h-10 mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
        <span v-if="passwordError" class="text-red-500 text-xs mt-1">{{ passwordError }}</span>
      </div>
      <button type="submit" :disabled="!isFormValid" class="mt-2 w-full bg-indigo-600 text-white py-2 px-4 rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-300">Submit</button>
    </form>
  </div>
</template>

<script>
import { defineComponent, ref, watch } from 'vue';
import { useForm, useField } from 'vee-validate';
import * as yup from 'yup';

export default defineComponent({
  name: 'AdvancedForm',
  setup() {
    const isFormValid = ref(false);
    const { handleSubmit, meta } = useForm({
      validationSchema: yup.object({
        name: yup.string().required('Name is required'),
        email: yup.string().email('Invalid email').required('Email is required'),
        password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
      }),
    });

    const { value: nameValue, errorMessage: nameError } = useField('name');
    const { value: emailValue, errorMessage: emailError } = useField('email');
    const { value: passwordValue, errorMessage: passwordError } = useField('password');

    watch(meta, (newMeta) => {
      isFormValid.value = newMeta.valid;
    });

    const onSubmit = (values) => {
      console.log('Form submitted:', values);
    };

    return {
      handleSubmit,
      nameValue,
      nameError,
      emailValue,
      emailError,
      passwordValue,
      passwordError,
      isFormValid,
      onSubmit,
    };
  },
});
</script>