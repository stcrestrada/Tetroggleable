class RemoveReferencesFromGames < ActiveRecord::Migration
  def change
    remove_column :games, :user_id, :references
  end
end
