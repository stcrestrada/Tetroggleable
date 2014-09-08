class SessionsController < ApplicationController
	def new
  end

  def create
    @user = User.find_by(:username => params[:username])
    if @user && @user.authenticate(params[:password])
      session[:user_id] = @user.id
      @game = @user.games.create()
      redirect_to game_path(@game)  
    else
      render :new
    end

  end

  def destroy
    session.clear
    redirect_to root_url
  end
end
