/*
* @Author: WanFeng
* @Date:   2018-06-09 21:46:09
* @Last Modified by:   WanFeng
* @Last Modified time: 2018-06-09 21:51:08
*/
$(document).ready(function(){
$(".flip").click(function(){
    $(".wrapper").slideToggle("slow");
    $(".flip").css("background-image",'url("../content/restore.png")');
  });
});