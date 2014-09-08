class User < ActiveRecord::Base
<<<<<<< HEAD
	has_secure_password 
	
	has_many :games


	validates :username, presence: true
	validates_uniqueness_of :username
	validates :email, presence: true
	validates_uniqueness_of :email
	validates :password, presence: true
=======

      has_many :games

	validates_presence_of :username, :email, :password_digest, unless: :guest?
	validates_uniqueness_of :username, allow_blank: true

      require 'bcrypt'
      attr_reader :password
      include ActiveModel::SecurePassword::InstanceMethodsOnActivation

      def name
        guest ? "Guest" : username
      end

  def self.new_guest
    new { |u| u.guest = true }
  end
>>>>>>> 80c6f35c193e5da7321f66c4f1dd7f62dfc9e31d

end
