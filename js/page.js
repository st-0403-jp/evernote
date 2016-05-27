/*page.js*/

model.page = (function () {
  return {
    top: function () {
      console.log('top');

      var apiToken = '047e837879226a69effa390d296712ae';
      var api = 'https://api.chatwork.com/v1/me';

      var $form = $('#apiForm');

      $('body').on('click', 'input[name=decide]', function (e) {
        e.preventDefault();
        $form.submit(function () {
          common.render.getData();
        });
      });
    }
  };
})();
