<script lang="ts">
    let email = "";
    let password = "";
</script>

<form method="POST" class="space-y-5 {$$props.class} flex flex-col">
    <input id="email" name="email" type="email" bind:value={email} required />
    <input
        id="password"
        name="password"
        type="password"
        bind:value={password}
        required
    />
    <button type="submit">Sign In</button>
</form>
