# == Schema Information
#
# Table name: users
#
#  id              :integer          not null, primary key
#  password_digest :string           not null
#  session_token   :string           not null
#  email           :string           not null
#  first_name      :string           not null
#  last_name       :string           not null
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#

class User < ActiveRecord::Base
 validates :email, :password_digest, :first_name, :last_name, :session_token, presence: true
 validates :password, length: { minimum: 6, allow_nil: true }

 attr_reader :password

 after_initialize :ensure_session_token

 def self.find_by_credentials(email, password)
   user = User.find_by(email: email)
   return nil unless user && user.valid_password?(password)
   user
 end

 def password=(password)
   @password = password
   self.password_digest = BCrypt::Password.create(password)
 end

 def valid_password?(password)
   BCrypt::Password.new(self.password_digest).is_password?(password)
 end

 def reset_token!
   self.session_token = SecureRandom.urlsafe_base64(16)
   self.save!
   self.session_token
 end

 private
 def ensure_session_token
   self.session_token ||= SecureRandom.urlsafe_base64(16)
 end
end
