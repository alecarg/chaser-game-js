menu.init = function(){
  menu.slide = 1;
  menu.bindEventHandlers();
  menu.playMusic();
  menu.show();
}

menu.show = function(){
  $('.menu').fadeIn();
}

menu.hide = function(){
  $('.menu').fadeOut();
}

menu.playMusic = function(){
  var audio = document.querySelector('audio');
  audio.volume = 0.1;
  audio.play();
}

menu.bindEventHandlers = function(){
  $('.next').on('click', this.nextSlide);
  $('.prev').on('click', this.prevSlide);
  $('.start').on('click', this.startGame);
}

menu.nextSlide = function(){
  $('.menu .top').animate({height: 0});
  $('.menu .bottom').animate({height: '100%'}, function(){
    $(this).addClass('transparent');
  });

  $('.menu .slide .btn.btn-primary').hide();

  $('.menu .slide-' + menu.slide).fadeOut(function(){
    menu.slide++;
    $('.menu .slide .btn.btn-primary').show();
    $('.menu .slide-' + menu.slide).fadeIn();
  })
}

menu.prevSlide = function(){
  $('.menu .slide-' + menu.slide).fadeOut(function(){
    menu.slide--;
    $('.menu .slide-' + menu.slide).fadeIn();
  })
}

menu.startGame = function(){
  $('.menu').fadeOut(function(){
    game.start();
  });
}