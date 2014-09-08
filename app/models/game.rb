class Game < ActiveRecord::Base
  belongs_to :user
  belongs_to :guest, :class => 'User', foreign_key: :user_id
end
