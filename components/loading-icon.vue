<template>
  <div class="loader" />
</template>

<style scoped>
.loader {
  width: 20px;
  padding: 4px;
  aspect-ratio: 1;
  border-radius: 50%;
  background: #71717a;
  --_m:
    conic-gradient(#71717a00 10%, #71717a),
    linear-gradient(#71717a 0 0) content-box;
  -webkit-mask: var(--_m);
  mask: var(--_m);
  -webkit-mask-composite: source-out;
  mask-composite: subtract;
  animation: l3 1s infinite cubic-bezier(0.455, 0.03, 0.515, 0.955);
}

@keyframes l3 {
  to {
    transform: rotate(1turn)
  }
}
</style>