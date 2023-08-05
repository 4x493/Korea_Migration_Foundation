var slideIndex = 0;
showSlides();

function showSlides() {
    var i;
    var slides = document.getElementsByClassName("slide");

    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";  
    }

    slideIndex++;
    
    if (slideIndex > slides.length){
        slideIndex = 1;
    }
    
    slides[slideIndex-1].style.display = "block";
    setTimeout(showSlides, 4000); // Change image every 2 seconds
}


var btn = document.getElementById('btn');

btn.addEventListener('click', function(e){
    e.preventDefault();

    var name = document.getElementById('name').value;
    var phone_number1 = document.getElementById('phone_number1').value;
    var phone_number2 = document.getElementById('phone_number2').value;
    var phone_number3 = document.getElementById('phone_number3').value;
    var resident_registration_number = document.getElementById('resident_registration_number').value;
    var email_front = document.getElementById('email_front').value;
    var email_back = document.getElementById('email_back').value;
    var donation_amount = document.getElementById('donation_amount').value;

    var body = '이름:<br/>' + name + '<br/><br/>전화번호:<br/>' + phone_number1 + ' ' + phone_number2 + ' ' + phone_number3 + '<br/><br/>주민등록번호:<br/>' + resident_registration_number + '<br/><br/>이메일:<br/>' + email_front + '@' + email_back + '<br/><br/>후원금액:<br/>' + donation_amount;

    Email.send({
        Host : "smtp.gmail.com",
        Username : "KoreaMigrationFoundation@gmail.com",
        Password : "lzlmqmthcotuskwa",
        To : 'KoreaMigrationFoundation@gmail.com',
        From : email_front + '@' + email_back,
        Subject : "후원 신청서",
        Body : body
    }).then(
        message => alert(message)
    );
});