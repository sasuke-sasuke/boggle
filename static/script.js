
$('form').on('click', '#submit', (e) => {
    e.preventDefault();
    guess = $('#guess').val();
    axios.post(`/words`, guess);
});