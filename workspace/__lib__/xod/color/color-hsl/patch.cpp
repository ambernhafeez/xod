
struct State {
};

// clang-format off
{{ GENERATED_CODE }}
// clang-format on

float HueToRGB(float v1, float v2, float vH) {

	if (vH < 0)
		vH += 1;

	if (vH > 1)
		vH -= 1;

	if ((6 * vH) < 1)
		return (v1 + (v2 - v1) * 6 * vH);

	if ((2 * vH) < 1)
		return v2;

	if ((3 * vH) < 2)
		return (v1 + (v2 - v1) * ((2.0f / 3) - vH) * 6);

	return v1;
}

void evaluate(Context ctx){

    float H = 360 * getValue<input_H>(ctx);
    float S = getValue<input_S>(ctx);
    float L = getValue<input_L>(ctx);

    uint8_t r, g, b;

    if (S == 0) {
        r = g = b = L * 255;
    } else {

        float hue = (float) H / 360;
        float v2 = (L < 0.5) ? (L * (1 + S)) : ((L + S) - (L * S));
		float v1 = 2 * L - v2;

		r = (uint8_t)(255 * HueToRGB(v1, v2, hue + (1.0f / 3)));
		g = (uint8_t)(255 * HueToRGB(v1, v2, hue));
		b = (uint8_t)(255 * HueToRGB(v1, v2, hue - (1.0f / 3)));
    }

    ValueType<output_OUT>::T obj;
    obj = { r, g, b };
    emitValue<output_OUT>(ctx, obj);
}
