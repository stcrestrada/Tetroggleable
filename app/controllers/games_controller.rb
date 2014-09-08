class GamesController < ApplicationController
	include UsersHelper

	def index
	end

	def show

		if current_user
			@game = Game.find(params[:id])
			@user = User.find(session[:user_id])
		else
			@game = Game.new
			flash.now[:notice] = "You are not logged in"
		end

	end

	def new
		@game = Game.new
	end

	def create
		if current_user
			@game = current_user.games.create(params[game_params])
			if @game.save
				redirect_to game_path
			end
		else
			flash.now[:notice] = "You are not logged in"
		end
	end

	private

	def game_params
		params.require(:game).permit(:score, :scrabble_score, :level, :lines, :user_id)
	end
end
