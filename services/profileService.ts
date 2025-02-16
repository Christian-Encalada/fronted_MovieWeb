interface PasswordChange {
  currentPassword: string;
  newPassword: string;
}

export const profileService = {
  changePassword: async (passwordData: PasswordChange): Promise<boolean> => {
    try {
      const response = await fetch('/api/profile/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(passwordData),
      });

      if (!response.ok) {
        throw new Error('Error al cambiar la contraseña');
      }

      return true;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }
};

export default profileService;
