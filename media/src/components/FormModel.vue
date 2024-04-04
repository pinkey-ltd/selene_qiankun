<template>
    <div class="modal-card" style="width: auto">
        <header class="modal-card-head">
            <p class="modal-card-title">{{ type ? "新建" : "修改" }}</p>
        </header>
        <section class="modal-card-body">
            <b-field label="Email">
                <b-input :value="store.currentForm.Name" placeholder="Your email" required>
                </b-input>
            </b-field>

            <b-field label="Password">
                <b-input :value="store.currentForm.Comments" password-reveal placeholder="Your password" required>
                </b-input>
            </b-field>

            <b-checkbox>Remember me</b-checkbox>
        </section>
        <footer class="modal-card-foot">
            <b-button label="取消" @click="close()" />
            <b-button label="提交" type="is-success" />
        </footer>
    </div>
</template>

<script setup lang="ts">
import { useStore } from '@/stores/play';
const store = useStore()
defineProps<{
    type?: string
}>()

// temp
const close = () => {
    console.log("close!!!")
}
</script>