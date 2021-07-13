<template>
<svg 
  v-if="!playState"
  version="1.1"
  id="Layer_1"
  xmlns="http://www.w3.org/2000/svg"
  xmlns:xlink="http://www.w3.org/1999/xlink"
  x="0px"
  y="0px"
	viewBox="0 0 386.972 386.972"
  style="enable-background:new 0 0 386.972 386.972;"
  xml:space="preserve"
>
<path d="M25.99,0v386.972l334.991-193.486L25.99,0z M55.99,51.972l245.009,141.514L55.99,335V51.972z" />
</svg>

<svg
  v-else
  version="1.1"
  id="Layer_1"
  xmlns="http://www.w3.org/2000/svg"
  xmlns:xlink="http://www.w3.org/1999/xlink"
  x="0px"
  y="0px"
  viewBox="0 0 472.615 472.615"
  style="enable-background:new 0 0 472.615 472.615;"
  xml:space="preserve"
>
<g>
	<g>
		<polygon points="50.273,0 50.273,472.615 422.342,236.308"/>
	</g>
</g>
</svg>
</template>

<script>
export default {
    name: "IconPlay",
    props: {
        playState: {
            type: Boolean,
            default: false,
        }
    }
}
</script>
