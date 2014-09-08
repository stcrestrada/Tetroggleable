class UsersController < ApplicationController
	include UsersHelper
	def index
		@users = User.all
	end

	def show
		@user = current_user
		@game = Game.where(:user_id == session[:user_id])
	end

	def new
		@user = User.new
	end

	def create
		@user = params[:user] ? User.new(user_params) : User.new_guest
		if @user.save
   			session[:user_id] = @user.id
			@game = @user.games.create()
			redirect_to game_path(@game)
		else
			render :new
		end
	end

	private

	def user_params
		params.require(:user).permit(:username, :email, :password)
	end

end
