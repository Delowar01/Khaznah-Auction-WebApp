# Production notes — final corrections

## Method

Built-in `image_gen` was used only for the authorized A3/A4/A6 background patches. Pillow/NumPy performed precise finishing. Original approved assets, rather than homepage screenshots, supplied the retained photographic pixels. No CLI/API fallback was used.

A3: retain source y 100–727, insert a 525 px background strip at original x 550, shift the right-hand source by 525 px. A4: retain source y 100–727, insert a 525 px background strip at original x 1430, shift the right-hand source by 525 px. A6: retain source y 90–717 and place the original at x 168; extend both outer edges by 168 px. All three final canvases are 2508 × 627.

The new background strip joins use a 32 px smooth blend for A3/A4 and 24 px for A6, entirely away from the key products. Original furniture/product regions overwrite the generated context and are byte-identical at the pixel level. The extensions include peripheral foliage/architecture where needed for a natural edge. No foreground resampling, model changes, global color changes, stretching or upscaling was used.

A2: keep the main connected chair alpha above 16/255, remove weak detached matte pixels, and zero RGB where fully transparent. All retained RGBA samples are unchanged; 8068 residual nonzero-alpha pixels were removed. A5: crop the original at [27, 54, 1227, 1254] without resampling. A1/A7: copy unchanged.

Patch edit targets were cropped views of the approved photographic originals with transparent gaps identifying missing background. Each target was inspected before editing. Only the filled background and narrow background blend regions were used; model-rendered product context was discarded.

## Final selected background-edit prompts

### A3

BACKGROUND PATCH EDIT ONLY. Output the exact same 3:2 image framing as the supplied 960x640 reference, high resolution. The vertical transparent/black missing middle strip (x216 through741 in reference) is an outpainting gap: fill ONLY that strip with a photorealistic continuous extension of the existing room background. Connect the intact left and right context seamlessly. Continue the same ivory sheer curtains, luminous window glazing, curtain hems/baseboard and warm wooden floor perspective from both sides. Warm afternoon light from the LEFT, coherent leaf shadows. Keep the curtain-to-floor boundary smoothly connecting both sides; no steps, no impossible geometry. Preserve reference framing and all existing left/right context exactly, do not zoom or recompose. No furniture, new objects, people, text, logos or watermark. Entire final patch is opaque photograph, including filled gap. This is a plain empty window-and-floor background patch, not a webpage.

### A4

BACKGROUND PATCH EDIT ONLY. Output the exact same 3:2 framing as the supplied 960x640 reference, high resolution. Fill the vertical transparent/black missing middle strip (reference x216 through741) with a photorealistic seamless extension of the same existing room background. Connect the intact left and right context. Continue ivory sheer curtains and luminous window, coherent curtain hem/baseboard and wooden floor perspective. Warm afternoon light from the RIGHT. Curtain-to-floor boundary must smoothly connect the left and right endpoints. Preserve all existing visible context and exact camera crop; do not zoom, mirror, or recompose the reference. Do not add furniture, objects, people, UI, text, logos or watermark. Entire output opaque, filled photograph. This independently composed Arabic scene is not to be mirrored.

### A6_left

BACKGROUND OUTPAINT PATCH. Keep the supplied square photograph's exact square framing, scale, crop and camera. The transparent/black strip covering the LEFT 26.25% is missing background: seamlessly extend the existing warm limestone architecture, plinth/base, floor and peripheral palm foliage into this strip. Preserve every already-visible product and architectural edge unchanged. DO NOT move, enlarge, shrink or redesign the tote, plinth or foliage. Continue existing perspective and left sun lighting. No additional products or furniture. No people, UI, letters, logos or watermarks. Fill only the blank strip; retain existing right 73.75% context exactly. Output opaque square photograph, high resolution.

### A6_right

BACKGROUND OUTPAINT PATCH. Keep supplied square photograph's exact square framing, scale, crop and camera. The transparent/black strip covering RIGHT26.25% is missing background: seamlessly extend existing warm limestone wall, base/plinth, peripheral palm foliage, rug edge and floor into this strip. Preserve every already-visible product and architectural edge unchanged. DO NOT move, enlarge, shrink or redesign the washing machine, suitcase, chair, lamp or any product. Continue existing perspective and warm left sun lighting. Do not add any products or furniture. No people, UI, letters, logos or watermarks. Fill only blank strip; retain existing left73.75% context exactly. Output opaque square photograph, high resolution.

