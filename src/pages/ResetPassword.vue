<template>
  <q-page class="padding">
    <q-form class="row justify-center" @submit.prevent="handleResetPassword">
      <p class="col-12 text-h5 text-center"> Reset Password </p>
      <div class="col-md-4 col-sm-6 col-xs-10 q-gutter-y-md">
        <q-input
          label="New Password"
          v-model="password"
          lazy-rules
          :rules="[val => (val && val.length >= 6) || 'Password is required and greater than 6 characters']"
        />
        <div class="full-width q-pt-md q-gutter-y-sm">
          <q-btn
            label="Send New Password"
            color="primary"
            class="full-width"
            outline
            rounded
            type="submit"
          />

        </div>
      </div>
    </q-form>
  </q-page>
</template>

<script>
import { defineComponent, ref } from 'vue'
import useAuthUser from 'src/composables/UseAuthUser'
import useNotify from 'src/composables/UseNotify'
import { useRouter, useRoute } from 'vue-router'

export default defineComponent({
  name: 'PageResetPassword',
  setup() {
    console.log('setup')
    const { resetPassword } = useAuthUser()
    const router = useRouter()
    const password = ref('')
    const { notifyError, notifySuccess } = useNotify()
    const route = useRoute()
    const token = route.query.token

    const handleResetPassword = async () => {
      try {
        await resetPassword(token, password.value)
        notifySuccess(`Password changed: ${password.value}`)
        router.push({name: 'login'})
      } catch (error) {
        notifyError(error.message)
      }
    }

    return {
      password,
      handleResetPassword
    }
  },
})
</script>

<style>

</style>
