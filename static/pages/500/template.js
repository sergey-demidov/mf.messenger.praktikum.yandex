export default `
  <div class="mpy_overlay">
    <div class="mpy_container">
      <div class="mpy_dialog">
        <div class="mpy_dialog_header">
          500
        </div>
        <div class="mpy_dialog_content mpy_lightgrey">
          <div class="mpy_text_input_wrapper">
            <p>
              Internal server error.
            </p>
            <p>
              Something went wrong.
            </p>
          </div>

        </div>
        <div class="mpy_dialog_footer mpy_lightgrey">
          <s-btn onclick="window.history.go(-1)">
            Back
          </s-btn>
          <s-btn onclick="window.location = '/';">
            Home
          </s-btn>
        </div>
      </div>
    </div>
  </div>
`;
//# sourceMappingURL=template.js.map