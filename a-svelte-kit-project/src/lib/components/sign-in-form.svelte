<script lang="ts">
    let email = "";
    let password = "";
</script>

<form method="post" class="flex-col border-2 border-slate-500 m-28">
    <div class="form-element">
        <label for="input1">Email</label>
        <input
            type="text"
            id="input1"
            placeholder="Input 1"
            class="input-field"
            bind:value={email}
        />
    </div>

    <div class="form-element">
        <label for="input2">Password</label>
        <input
            type="text"
            id="input2"
            placeholder="Input 2"
            class="input-field"
            bind:value={password}
        />
    </div>

    <button class="border-2 w-auto px-4 py-2 justify-self-center">Sign In</button>
</form>

<style>
    .form-element {
        @apply flex mb-2 border-b-2 pb-2 space-x-2;
    }

    .input-field {
        @apply border-2 border-gray-300 mb-4;
    }
</style>
