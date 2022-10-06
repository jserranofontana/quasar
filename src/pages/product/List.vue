<template>
  <q-page padding>
    <div class="row">
      <q-table
        title="Treats"
        :rows="products"
        :columns="columnsProduct"
        row-key="id"
        class="col-12"
        :loading="loading"
      >
      <template v-slot:top>
        <span class="text-h6">
          Product
        </span>
        <q-btn
          label="My Store"
          dense
          size="sm"
          outline
          class="q-ml-sm"
          icon="mdi-store"
          color="primary"
          @click="handleGoToStore"
        />
        <q-btn
          label="Copy Link"
          dense
          size="sm"
          outline
          class="q-ml-sm"
          icon="mdi-content-copy"
          color="primary"
          @click="handleCopyPublicUrl"
        />
        <q-space/>
        <q-btn
          v-if="$q.platform.is.desktop"
          label="ADD NEW"
          color="primary"
          icon="mdi-plus"
          dense
          :to="{name: 'form-product'}"
        />
      </template>
      <template v-slot:body-cell-img_url="props">
        <q-td :props="props">
          <q-avatar v-if="props.row.img_url" square>
            <img :src="props.row.img_url"/>
          </q-avatar>
          <q-avatar v-else color="grey" text-color="white" icon="mdi-image-off"/>
        </q-td>
      </template>
        <template v-slot:body-cell-actions="props">
          <q-td :props="props" class="q-gutter-x-sm">
            <q-btn icon="mdi-pencil-outline" color="info" dense size="sm" @click="handleEdit(props.row)">
              <q-tooltip>
                Edit
              </q-tooltip>
            </q-btn>
            <q-btn icon="mdi-delete-outline" color="negative" dense size="sm" @click="handleRemoveProduct(props.row)">
              <q-tooltip>
                Delete
              </q-tooltip>
            </q-btn>
          </q-td>
        </template>

      </q-table>
    </div>
    <q-page-sticky position="bottom-right" :offset="[18, 18]" v-if="$q.platform.is.mobile">
      <q-btn fab icon="mdi-plus" color="primary" :to="{name: 'form-product'}"/>
    </q-page-sticky>
  </q-page>
</template>
<script>
import { defineComponent, ref, onMounted } from "vue"
import useApi from 'src/composables/UseAPI'
import useAuthUser from "src/composables/UseAuthUser.js"
import useNotify from "src/composables/UseNotify"
import { useRouter } from 'vue-router'
import { useQuasar, openURL, copyToClipboard } from 'quasar'
import { columnsProduct } from './table.js'


export default defineComponent({
  name: 'PageProductList',
  setup() {
    const products = ref([])
    const loading = ref(true)
    const router = useRouter()
    const table = 'product'
    const $q = useQuasar()
    const { listPublic, remove } = useApi()
    const { notifyError, notifySuccess } = useNotify()
    const { user } = useAuthUser()

    const handleListProducts = async () => {
      try {
        loading.value = true
        products.value = await listPublic(table, user.value.id)
        loading.value = false
      } catch (error) {
        notifyError(error.message)
      }
    }

    onMounted(() => {
      handleListProducts()
    })

    const handleGoToStore = () => {
      const idUser = user.value.id;
      // router.push({
      //   name: 'product-public',
      //   params: {
      //     id: idUser
      //   }
      // })
      const link = router.resolve({
        name: 'product-public',
        params: {
          id : idUser
        }
      })
      openURL(window.origin + link.href)
    }

    const handleCopyPublicUrl = () => {
      const idUser = user.value.id;
      const link = router.resolve({
        name: 'product-public',
        params: {
          id : idUser
        }
      })
      const externalLink = window.origin + link.href
      copyToClipboard(externalLink)
        .then(() => {
          notifySuccess('Succesfully copied')
        })
        .catch(() => {
          notifyError('Error copying link')
        })
    }

    const handleEdit = (product) =>  {
      router.push({name: 'form-product', params: { id: product.id }})
    }

    const handleRemoveProduct = async(product) => {
      try {
        $q.dialog({
          title: 'Confirm',
          message: `Do you really delete ${product.name} ?`,
          cancel: true,
          persistent: true
        }).onOk(async () => {
          await remove(table, product.id)
          notifySuccess('successfully deleted')
          handleListProducts()
        })
      } catch(error) {
        notifyError(error.msg)
      }
    }

    return {
      columnsProduct,
      products,
      loading,
      handleEdit,
      handleRemoveProduct,
      handleGoToStore,
      handleCopyPublicUrl
    }
  }
})

</script>
