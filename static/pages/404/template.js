export default `
  <div class="mpy_overlay">
    <div class="mpy_container">
      <div class="mpy_dialog">
        <div class="mpy_dialog_header">
          404
        </div>
        <div class="mpy_dialog_content mpy_lightgrey">
          <div class="mpy_text_input_wrapper" style="padding: 20px 40px;">
            <p>
              Page not found.
            </p>
            <p>
              It was a wrong turn.
            </p>
          </div>
        </div>
        <div class="mpy_dialog_footer mpy_lightgrey">
          <s-btn onclick="window.history.go(-2)">
            Back
          </s-btn>
          <s-btn onclick="window.router.go('/');">
            Home
          </s-btn>
        </div>
      </div>
    </div>
  </div>
`;
//# sourceMappingURL=template.js.map